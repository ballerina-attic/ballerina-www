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
package org.ballerinalang.platform.playground.launcher;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.ballerinalang.platform.playground.launcher.core.RunSession;
import org.ballerinalang.platform.playground.launcher.dto.Command;
import org.ballerinalang.platform.playground.launcher.dto.CommandAdaptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;
import java.util.Map;

/**
 * Micro Service for run api of playground.
 */
@ServerEndpoint(value = "/api/run")
public class LauncherService {

    private Map<String, RunSession> runSessionMap = new HashMap<String, RunSession>();

    private static final Logger logger = LoggerFactory.getLogger(LauncherService.class);

    private static final Gson gson;

    static {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Command.class, new CommandAdaptor());
        gson = builder.create();
    }

    @OnOpen
    public void onOpen (Session session) {
        runSessionMap.put(session.getId(), new RunSession(session));
    }

    @OnMessage
    public void onTextMessage(String message, Session session) {
        runSessionMap.get(session.getId()).processCommand(gson.fromJson(message, Command.class));
    }

    @OnClose
    public void onClose(CloseReason closeReason, Session session) {
        runSessionMap.get(session.getId()).terminate();
        runSessionMap.remove(session.getId());
    }

    @OnError
    public void onError(Throwable throwable, Session session) {
        logger.error("Error occurred in run api" , throwable);
    }

}
