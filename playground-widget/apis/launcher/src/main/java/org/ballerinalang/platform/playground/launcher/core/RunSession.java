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
package org.ballerinalang.platform.playground.launcher.core;

import com.google.gson.Gson;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.ballerinalang.platform.playground.launcher.core.cache.CacheStorage;
import org.ballerinalang.platform.playground.launcher.core.interceptor.ConsoleMessageInterceptor;
import org.ballerinalang.platform.playground.launcher.core.phase.BuildPhase;
import org.ballerinalang.platform.playground.launcher.core.phase.StartDependantServicePhase;
import org.ballerinalang.platform.playground.launcher.core.phase.StartPhase;
import org.ballerinalang.platform.playground.launcher.core.phase.TryItPhase;
import org.ballerinalang.platform.playground.launcher.dto.Command;
import org.ballerinalang.platform.playground.launcher.dto.Message;
import org.ballerinalang.platform.playground.launcher.dto.RunCommand;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.Session;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Represents a Run Session on playground
 */
public class RunSession {

    public static final String OUTPUT_DELIMITTER= "---OUTPUT----";

    private final Session transportSession;

    private RunCommand runCommand;

    private static final Logger logger = LoggerFactory.getLogger(RunSession.class);

    private Path sourceFile;

    private Path buildFile;

    private String sourceMD5;

    private String outputCacheId;

    private ConcurrentLinkedQueue<String> outputCache = new ConcurrentLinkedQueue<>();

    private String servicePort = StringUtils.EMPTY;

    private String serviceHost = StringUtils.EMPTY;

    private volatile boolean requestedToAbort = false;

    private List<ConsoleMessageInterceptor> consoleMessageInterceptors;

    private BuildPhase buildPhase;

    private StartDependantServicePhase dependantServicePhase;

    private StartPhase startPhase;

    private TryItPhase tryItPhase;

    private CacheStorage cacheStorage;

    public RunSession(Session transportSession) {
        this.transportSession = transportSession;
        consoleMessageInterceptors = new ArrayList<>();
        cacheStorage = new CacheStorage();
    }

    public void run(RunCommand runCommand) {
        this.runCommand = runCommand;
        // if ballerina home is not set
        if (null == System.getProperty(Constants.BALLERINA_HOME)) {
            pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR, "Cannot find ballerina home." +
                    "Please set ballerina.home system property.");
            return;
        }
        try {
            byte[] bytesOfSource = runCommand.getSource().getBytes("UTF-8");
            byte[] bytesOfCurl = runCommand.getCurl().getBytes("UTF-8");
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            String sourceMd5 = new String(md5.digest(bytesOfSource));
            setSourceMD5(sourceMd5);
            String curlMd5 = new String(md5.digest(bytesOfCurl));
            String sourceAndCurlMd5 = new String(md5.digest((curlMd5 + sourceMd5).getBytes("UTF-8")));
            setOutputCacheId(sourceAndCurlMd5);
            if (useOutputCache()) {
                List<String> cachedOutput = getCachedOutput();
                String buildCompletedRegex = "build completed in [\\d]+ms";
                String curlCompletedRegex = "executing curl completed in [\\d]+ms";
                new Thread(() -> {
                    Instant buildStart = Instant.now();
                    Instant curlStart = Instant.now();
                    for (String aCachedOutput : cachedOutput) {
                        if (requestedToAbort) {
                            break;
                        }
                        try {
                            if (aCachedOutput.contains("CURL_EXEC_STARTED")) {
                                curlStart = Instant.now();
                            }
                            Matcher buildCompletedMsg = Pattern.compile(buildCompletedRegex).matcher(aCachedOutput);
                            if (buildCompletedMsg.find()) {
                                Thread.sleep(Math.round(Math.random() * 1000) + 1500);
                                aCachedOutput = buildCompletedMsg
                                        .replaceAll("build completed in "
                                                + Math.round(Duration.between(buildStart, Instant.now()).toMillis())
                                                +"ms");
                            }
                            Matcher curlCompletedMsg = Pattern.compile(curlCompletedRegex).matcher(aCachedOutput);
                            if (curlCompletedMsg.find()) {
                                aCachedOutput = curlCompletedMsg
                                        .replaceAll("executing curl completed in "
                                                + Math.round(Duration.between(curlStart, Instant.now()).toMillis())
                                                +"ms");
                            }
                            transportSession.getBasicRemote().sendText(aCachedOutput);
                            Thread.sleep(100);
                        } catch (Exception e) {
                            logger.error("Error while sending cached output", e);
                        }
                    }
                }).start();
                return;
            }
            if (!useBuildCache()) {
                createSourceFile();
            }
            buildPhase = new BuildPhase();
            if (requestedToAbort) {
                return;
            }
            buildPhase.execute(this, () -> {
                if (requestedToAbort) {
                    return;
                }
                String dependantService = runCommand.getDependantService();
                if (dependantService != null && !dependantService.equals(StringUtils.EMPTY)) {
                    dependantServicePhase = new StartDependantServicePhase();
                    try {
                        dependantServicePhase.execute(this, () -> {
                            if (requestedToAbort) {
                                terminate();
                                return;
                            }
                            startPhase = new StartPhase();
                            try {
                                startPhase.execute(this, () -> {
                                    if (requestedToAbort) {
                                        return;
                                    }
                                    tryItPhase = new TryItPhase();
                                    tryItPhase.execute(this, () -> {
                                        terminate();
                                        if (!useOutputCache()) {
                                            StringJoiner outputJoiner = new StringJoiner(OUTPUT_DELIMITTER);
                                            getCacheStorage().set(getOutputCacheId(), outputJoiner.toString());
                                        }
                                    });
                                });
                            } catch (Exception e) {
                                pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR,
                                        "Error occurred while running sample. " + e.getMessage());
                            }

                        });
                    } catch (Exception e) {
                        pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR,
                                "Error occurred while starting dependent service. " + e.getMessage());
                    }
                } else {
                    startPhase = new StartPhase();
                    try {
                        startPhase.execute(this, () -> {
                            if (requestedToAbort) {
                                return;
                            }
                            tryItPhase = new TryItPhase();
                            tryItPhase.execute(this, () -> {
                                terminate();
                                if (!useOutputCache()) {
                                    StringJoiner outputJoiner = new StringJoiner(OUTPUT_DELIMITTER);
                                    getOutputCache().forEach(outputJoiner::add);
                                    getCacheStorage().set(getOutputCacheId(), outputJoiner.toString());
                                }
                            });
                        });
                    } catch (Exception e) {
                        pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR,
                                "Error occurred while running sample. " + e.getMessage());
                    }
                }
            });
        } catch (Exception e) {
            pushMessageToClient(Constants.ERROR_MSG, Constants.ERROR,
                    "Error occurred while building sample. " + e.getMessage());
        }
    }

    public boolean useBuildCache() {
       return getCacheStorage().contains(getSourceMD5())
                && Paths.get(getCacheStorage().get(getSourceMD5())).toFile().exists();
    }

    public boolean useOutputCache() {
        return getCacheStorage().contains(getOutputCacheId());
    }

    public List<String> getCachedOutput() {
        return Arrays.asList(getCacheStorage().get(getOutputCacheId()).split(OUTPUT_DELIMITTER));
    }

    public ConcurrentLinkedQueue<String> getOutputCache() {
        return outputCache;
    }

    public Path getBuildFileFromCache() {
        return Paths.get(getCacheStorage().get(getSourceMD5()));
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
    public synchronized void pushMessageToClient(Message status) {
        Gson gson = new Gson();
        String json = gson.toJson(status);
        try {
            if (!useOutputCache()) {
                getOutputCache().add(json);
            }
            if (getSourceFile() != null) {
                json = json.replaceAll(getSourceFile().getFileName().toAbsolutePath().toString(),
                        getRunCommand().getFileName());
            }
            if (getBuildFile() != null) {
                json = json.replaceAll(getBuildFile().getFileName().toAbsolutePath().toString(),
                        getRunCommand().getFileName());
            }
            transportSession.getBasicRemote().sendText(json);
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

    public void setBuildFile(Path buildFile) {
        this.buildFile = buildFile;
    }

    public Path getBuildFile() {
        return useBuildCache() ? getBuildFileFromCache() : buildFile;
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

    public String getSourceMD5() {
        return sourceMD5;
    }

    public void setSourceMD5(String sourceMD5) {
        this.sourceMD5 = sourceMD5;
    }

    public String getOutputCacheId() {
        return outputCacheId;
    }

    public void setOutputCacheId(String outputCacheId) {
        this.outputCacheId = outputCacheId;
    }

    public String processConsoleMessage(String consoleMessage) {
        String finalMessage = consoleMessage;
        for (ConsoleMessageInterceptor messageInterceptor: consoleMessageInterceptors) {
            finalMessage = messageInterceptor.interceptConsoleMessage(finalMessage);
        }
        return finalMessage;
    }

    public CacheStorage getCacheStorage() {
        return cacheStorage;
    }

    public void terminate() {
        if (buildPhase != null) {
            buildPhase.terminate(this);
        }
        if (dependantServicePhase != null) {
            dependantServicePhase.terminate(this);
        }
        if (startPhase != null) {
            startPhase.terminate(this);
        }
        if (tryItPhase != null) {
            tryItPhase.terminate(this);
        }
    }

    private void createSourceFile() {
        try {
            Path sourceRoot = Files.createTempDirectory("playground-sample");
            File tmpFile = File.createTempFile("playground-sample", ".bal", sourceRoot.toFile());
            FileUtils.writeStringToFile(tmpFile, runCommand.getSource());
            sourceFile = tmpFile.toPath();
            buildFile = Paths.get(tmpFile.getAbsolutePath().replace(".bal", ".balx"));
        } catch (IOException e) {
            logger.error("Unable to save sample content to a bal file.", e);
        }
    }

}
