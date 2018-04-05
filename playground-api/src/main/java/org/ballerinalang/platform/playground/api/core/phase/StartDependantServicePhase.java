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
package org.ballerinalang.platform.playground.api.core.phase;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.ballerinalang.platform.playground.api.core.Constants;
import org.ballerinalang.platform.playground.api.core.RunSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Start Dependant Service Phase of Run
 */
public class StartDependantServicePhase implements Phase {

    private static final Logger logger = LoggerFactory.getLogger(StartDependantServicePhase.class);
    private RunSession session;

    /**
     * Construct the command array to be executed.
     * @return String[] command array
     */
    private String[] getRunCommandArray(RunSession session) throws IOException {
        List<String> commandList = new ArrayList<>();
        // path to ballerina
        commandList.add("ballerina");
        commandList.add("run");
        commandList.add("/services/" + session.getRunCommand().getDependantService() + ".balx");
        return commandList.toArray(new String[0]);
    }
    
    @Override
    public void execute(RunSession runSession, Runnable next) throws Exception{
        this.session = runSession;
        String[] cmdArray = getRunCommandArray(runSession);
        Process launchProcess = Runtime.getRuntime().exec(cmdArray, null, new File("/services/"));

        runSession.pushMessageToClient(Constants.CONTROL_MSG, Constants.DEP_SERVICE_EXECUTION_STARTED,
                "starting dependant service");

        // kill the program process after specified timeout
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                if (launchProcess != null && launchProcess.isAlive()) {
                    terminate();
                }
            }
        }, Constants.PROGRAM_TIMEOUT);

        new Thread(() -> {
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new InputStreamReader(launchProcess.getInputStream(), Charset
                        .defaultCharset()));
                String line = "";
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("ballerina: started HTTP/WS server connector")) {
                        next.run();
                    }
                }
            } catch (IOException e) {
                logger.error("Error while sending output stream.");
            } finally {
                if (reader != null) {
                    IOUtils.closeQuietly(reader);
                }
            }
        }).start();

        new Thread(() -> {
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new InputStreamReader(
                        launchProcess.getErrorStream(), Charset.defaultCharset()));
                String line = "";
                while ((line = reader.readLine()) != null) {
                    runSession.pushMessageToClient(Constants.CONTROL_MSG, Constants.DEP_SERVICE_EXECUTION_ERROR,
                            line);

                }
            } catch (IOException e) {
                logger.error("Error while sending error stream.", e);
            } finally {
                if (reader != null) {
                    IOUtils.closeQuietly(reader);
                }
            }
        }).start();
    }


    /**
     * Terminate running ballerina program.
     */
    public void terminate() {
        String cmd = "/services/" + session.getRunCommand().getDependantService() + ".balx";
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
                    this.session.pushMessageToClient(Constants.CONTROL_MSG, Constants.DEP_SERVICE_EXECUTION_STOPPED,
                            "stopped dependant service");
                } catch (Throwable e) {
                    logger.error("Unable to kill process " + line + ".");
                }
            }
        } catch (Throwable e) {
            logger.error("Unable to find the process ID for " + cmd + ".");
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
