package org.ballerinalang.platform.playground.controller;

import org.ballerinalang.platform.playground.controller.scaling.LauncherAutoscaler;

import javax.ws.rs.Path;

@Path(value = "/api")
public class TestControllerService {

    private LauncherAutoscaler autoscaler;

    public TestControllerService(int maxCount, int limitGap, LauncherAutoscaler autoscaler) {
        this.autoscaler = autoscaler;
    }
}
