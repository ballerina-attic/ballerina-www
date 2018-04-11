package org.ballerinalang.platform.playground.controller.service;

import io.netty.handler.codec.http.HttpHeaderNames;
import org.ballerinalang.platform.playground.controller.service.model.LauncherResponse;
import org.ballerinalang.platform.playground.controller.service.model.StatusUpdateRequest;
import org.ballerinalang.platform.playground.controller.util.Constants;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path(value = "/api")
public class ControllerService {

//    private static final Logger log = LoggerFactory.getLogger(ControllerService.class);

    private ControllerServiceManager serviceManager;

    public ControllerService(ControllerServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    @GET
    @Path("/launcher/free")
    @Produces(MediaType.APPLICATION_JSON)
    public Response allocateLauncher() {
        String launcherUrl = serviceManager.allocateFreeLauncher();

        // TODO: scale check

        if (launcherUrl != null) {
            return Response.status(Response.Status.OK)
                    .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                    .type(MediaType.APPLICATION_JSON)
                    .entity(new LauncherResponse(launcherUrl))
                    .build();
        } else {
            return Response.status(Response.Status.NOT_FOUND)
                    .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                    .build();
        }
    }

    @POST
    @Path("/launcher/status")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response markMemberFree(StatusUpdateRequest request) {
        // Check if launcher url actually exists
        if (!serviceManager.launcherExists(request.getLauncherUrl())) {
            return Response.status(Response.Status.NOT_FOUND)
                    .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                    .build();
        }

        // Check if sent status is valid
        switch (request.getStatus()) {
            case Constants.MEMBER_STATUS_FREE:
                serviceManager.markLauncherFree(request.getLauncherUrl());
                return Response.status(Response.Status.OK)
                        .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                        .build();
            case Constants.MEMBER_STATUS_BUSY:
                serviceManager.markLauncherBusy(request.getLauncherUrl());
                return Response.status(Response.Status.OK)
                        .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                        .build();
            default:
                return Response.status(Response.Status.BAD_REQUEST)
                        .header(HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN.toString(), '*')
                        .build();
        }
    }
}
