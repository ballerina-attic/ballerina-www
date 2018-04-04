/*
 * Copyright (c) 2018, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.ballerinalang.platform.playground.api.core;

import com.google.gson.Gson;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.ballerinalang.platform.playground.api.core.interceptor.ConsoleMessageInterceptor;
import org.ballerinalang.platform.playground.api.core.phase.BuildPhase;
import org.ballerinalang.platform.playground.api.core.phase.StartPhase;
import org.ballerinalang.platform.playground.api.core.phase.TryItPhase;
import org.ballerinalang.platform.playground.api.dto.Command;
import org.ballerinalang.platform.playground.api.dto.Message;
import org.ballerinalang.platform.playground.api.dto.RunCommand;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.Session;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a Run Session on playground
 */
public class RunSession {

    private Session transportSession;

    private RunCommand runCommand;

    private static final Logger logger = LoggerFactory.getLogger(RunSession.class);

    private Path sourceFile;

    private Path sourceRoot;

    private Path buildFile;

    private String servicePort = StringUtils.EMPTY;

    private String serviceHost = StringUtils.EMPTY;

    private volatile boolean requestedToAbort = false;

    private List<ConsoleMessageInterceptor> consoleMessageInterceptors;

    public RunSession(Session transportSession) {
        this.transportSession = transportSession;
        this.consoleMessageInterceptors = new ArrayList<>();
    }

    public void run(RunCommand runCommand) {
        this.runCommand = runCommand;
        // if ballerina home is not set
        if (null == System.getProperty(Constants.BALLERINA_HOME)) {
            pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR, "Cannot find ballerina home." +
                    "Please set ballerina.home system property.");
            return;
        }
        createSourceFile();
        BuildPhase buildPhase = new BuildPhase();
        if (requestedToAbort) {
            return;
        }
        try {
            buildPhase.execute(this, () -> {
                if (requestedToAbort) {
                    return;
                }
                StartPhase startPhase = new StartPhase();
                try {
                    startPhase.execute(this, () -> {
                        if (requestedToAbort) {
                            return;
                        }
                        TryItPhase tryItPhase = new TryItPhase();
                        tryItPhase.execute(this, this::terminate);
                    });
                } catch (Exception e) {
                    pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR,
                            "Error occurred running sample. " + e.getMessage());
                }
            });
        } catch (Exception e) {
            pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR,
                    "Error occurred building sample. " + e.getMessage());
        }
    }

    public void processCommand(Command command) {
        switch (command.getCommand()) {
            case "run" :
                run((RunCommand) command);
                break;
            case "stop":
                requestedToAbort = true;
                pushMessageToClient(Constants.CONTROL_MSG, Constants.RUN_ABORTED,
                        "aborted");
                terminate();
                break;
            default:
        }
    }

    /**
     * Push message to client.
     * @param status  the status
     */
    public void pushMessageToClient(Message status) {
        Gson gson = new Gson();
        String json = gson.toJson(status);
        try {
            this.transportSession.getBasicRemote().sendText(json);
        } catch (IOException e) {
            logger.error("Error while pushing messages to client.", e);
        }
    }

    public void pushMessageToClient(String type, String code, String text) {
        Message message = new Message();
        message.setType(type);
        message.setCode(code);
        message.setMessage(text);
        pushMessageToClient(message);
    }

    public Path getSourceFile() {
        return sourceFile;
    }

    public Path getSourceRoot() {
        return sourceRoot;
    }

    public Path getBuildFile() {
        return buildFile;
    }

    public String getBallerinaExecPath() {
        return Paths.get(System.getProperty(Constants.BALLERINA_HOME) , "bin", "ballerina").toString();
    }

    public RunCommand getRunCommand() {
        return runCommand;
    }

    public String getServicePort() {
        return servicePort;
    }

    public void setServicePort(String servicePort) {
        this.servicePort = servicePort;
    }

    public String getServiceHost() {
        return serviceHost;
    }

    public void setServiceHost(String serviceHost) {
        this.serviceHost = serviceHost;
    }

    public String processConsoleMessage(String consoleMessage) {
        String finalMessage = consoleMessage;
        for (ConsoleMessageInterceptor messageInterceptor: consoleMessageInterceptors) {
            finalMessage = messageInterceptor.interceptConsoleMessage(finalMessage);
        }
        return finalMessage;
    }

    private void createSourceFile() {
        try {
            sourceRoot = Files.createTempDirectory("playground-sample");
            File tmpFile = File.createTempFile("playground-sample", ".bal", sourceRoot.toFile());
            FileUtils.writeStringToFile(tmpFile, runCommand.getSource());
            sourceFile = tmpFile.toPath();
            buildFile = Paths.get(tmpFile.getAbsolutePath().replace(".bal", ".balx"));
        } catch (IOException e) {
            logger.error("Unable to save sample content to a bal file.", e);
        }
    }

    /**
     * Terminate running ballerina program.
     */
    public void terminate() {
        String cmd = getBuildFile().toString();
        int processID;
        String[] findProcessCommand = getFindProcessCommand(cmd);
        BufferedReader reader = null;
        try {
            Process findProcess = Runtime.getRuntime().exec(findProcessCommand);
            findProcess.waitFor();
            reader = new BufferedReader(new InputStreamReader(findProcess.getInputStream(), Charset.defaultCharset()));

            String line;
            while ((line = reader.readLine()) != null) {
                try {
                    processID = Integer.parseInt(line);
                    killChildProcesses(processID);
                    kill(processID);
                    pushMessageToClient(Constants.CONTROL_MSG, Constants.PROGRAM_TERMINATED,
                            "program terminated");
                } catch (Throwable e) {
                    logger.error("Launcher was unable to kill process " + line + ".");
                }
            }
        } catch (Throwable e) {
            logger.error("Launcher was unable to find the process ID for " + cmd + ".");
        } finally {
            if (reader != null) {
                IOUtils.closeQuietly(reader);
            }
        }
    }

    /**
     * Terminate running ballerina program.
     *
     * @param pid - process id
     */
    private void kill(int pid) {
        if (pid < 0) {
            return;
        }
        String killCommand = String.format("kill -9 %d", pid);
        try {
            Process kill = Runtime.getRuntime().exec(killCommand);
            kill.waitFor();
        } catch (Throwable e) {
            logger.error("Launcher was unable to terminate process:" + pid + ".");
        }
    }

    /**
     * Terminate running all child processes for a given pid.
     *
     * @param pid - process id
     */
    private void killChildProcesses(int pid) {
        BufferedReader reader = null;
        try {
            Process findChildProcess = Runtime.getRuntime().exec(String.format("pgrep -P %d", pid));
            findChildProcess.waitFor();
            reader = new BufferedReader(new InputStreamReader(findChildProcess.getInputStream(),
                    Charset.defaultCharset()));
            String line;
            int childProcessID;
            while ((line = reader.readLine()) != null) {
                childProcessID = Integer.parseInt(line);
                kill(childProcessID);
            }
        } catch (Throwable e) {
            logger.error("Launcher was unable to find parent for process:" + pid + ".");
        } finally {
            if (reader != null) {
                IOUtils.closeQuietly(reader);
            }
        }
    }

    /**
     * Get find process command.
     *
     * @param script absolute path of ballerina file running
     * @return find process command
     */
    private String[] getFindProcessCommand(String script) {

        String[] cmd = {
                "/bin/sh",
                "-c",
                "ps -ef -o pid,args | grep " +
                        script + " | grep run | grep ballerina | grep -v 'grep " +
                        script + "' | awk '{print $1}'"
        };
        return cmd;
    }

}
