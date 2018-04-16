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

package org.ballerinalang.platform.playground.controller.service;

import io.netty.handler.codec.http.HttpHeaderNames;
import org.ballerinalang.platform.playground.utils.MemberConstants;
import org.ballerinalang.platform.playground.utils.RedisClient;
import org.ballerinalang.platform.playground.utils.cache.CacheUtils;
import org.ballerinalang.platform.playground.utils.model.LauncherRequest;
import org.ballerinalang.platform.playground.utils.model.LauncherResponse;
import org.ballerinalang.platform.playground.utils.model.StatusUpdateRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path(value = "/api")
public class ControllerService {

    private static final Logger log = LoggerFactory.getLogger(ControllerService.class);

    private ControllerServiceManager serviceManager;

    public ControllerService(ControllerServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    @POST
    @Path("/launcher")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response allocateLauncher(LauncherRequest request) {
        String outputCacheId = CacheUtils.getOutputCacheID(request.getSource(), request.getCurl());
        LauncherResponse response;
        if (CacheUtils.cacheExists(outputCacheId)) {
            String cacheResponderUrl = serviceManager.getCacheResponderUrl();
            response = new LauncherResponse(cacheResponderUrl, outputCacheId);
        } else {
            // Get a free launcher URL
            String launcherUrl = serviceManager.allocateFreeLauncher();
            if (launcherUrl != null) {
                response = new LauncherResponse(launcherUrl);
            } else {
                return buildNotFoundResponse();
            }
        }
        return Response.status(Response.Status.OK)
                .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                .type(MediaType.APPLICATION_JSON)
                .entity(response)
                .build();
    }

    @POST
    @Path("/launcher")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response setLauncherStatus(StatusUpdateRequest request) {
        // Check if sent status is valid
        switch (request.getStatus()) {
            case MemberConstants.MEMBER_STATUS_FREE:
                if (serviceManager.markLauncherFree(request.getLauncherUrl())) {
                    log.info("Marking launcher [URL] " + request.getLauncherUrl() + " as free...");
                    return Response.status(Response.Status.OK)
                            .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                            .build();
                } else {
                    log.warn("Launcher [URL] " + request.getLauncherUrl() + " not found.");
                    return buildNotFoundResponse();
                }
            case MemberConstants.MEMBER_STATUS_BUSY:
                if (serviceManager.markLauncherBusy(request.getLauncherUrl())) {
                    log.info("Marking launcher [URL] " + request.getLauncherUrl() + " as busy...");
                    return Response.status(Response.Status.OK)
                            .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                            .build();
                } else {
                    log.warn("Launcher [URL] " + request.getLauncherUrl() + " not found.");
                    return buildNotFoundResponse();
                }
            default:
                log.warn("Invalid launcher status: " + request.getLauncherUrl());
                return Response.status(Response.Status.BAD_REQUEST)
                        .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                        .build();
        }
    }

    private Response buildNotFoundResponse() {
        return Response.status(Response.Status.NOT_FOUND)
                .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                .build();
    }
}
