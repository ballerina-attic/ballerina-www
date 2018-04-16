package org.ballerinalang.platform.playground.controller.service;

import io.netty.handler.codec.http.HttpHeaderNames;
import org.ballerinalang.platform.playground.utils.MemberConstants;
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

    @GET
    @Path("/launcher")
    @Produces(MediaType.APPLICATION_JSON)
    public Response allocateLauncher() {
        // Get a free launcher URL
        String launcherUrl = serviceManager.allocateFreeLauncher();

        // TODO: check if cache exists

        if (launcherUrl != null) {
            return Response.status(Response.Status.OK)
                    .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                    .type(MediaType.APPLICATION_JSON)
                    .entity(new LauncherResponse(launcherUrl))
                    .build();
        } else {
            return buildNotFoundResponse();
        }
    }

    @POST
    @Path("/launcher/status")
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
