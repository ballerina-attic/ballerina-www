package org.ballerinalang.platform.playground.controller.scaling;


import org.ballerinalang.platform.playground.controller.util.ContainerRuntimeClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LauncherAutoscaler {

    private static final Logger log = LoggerFactory.getLogger(LauncherAutoscaler.class);

    private int stepUp;
    private int stepDown;
    private ContainerRuntimeClient runtimeClient;

    public LauncherAutoscaler(ContainerRuntimeClient runtimeClient, int stepUp, int stepDown) {
        this.stepDown = stepDown;
        this.stepUp = stepUp;
        this.runtimeClient = runtimeClient;
    }

    public static void doScaling(int totalCount, int freeCount) {
        int busyCount = totalCount - freeCount;


//        while (freeCount < limitGap) {
//            log.debug("Scaling up as [Free Count] " + freeCount + " is less than the specified [Limit Gap] " + limitGap);
//            scaleUp();
//        }
//
//        while (totalCount > maxCount) {
//            log.debug("Scaling down as [Total Count] " + totalCount + " is larger than the specified [Max Count] " + maxCount);
//            scaleDown();
//        }
    }

    public void scaleDown() {
        // TODO: scale down by 1xstepDown at a time
    }

    public void scaleUp() {
        // TODO: scale up by 1xscaleUp at a time
        runtimeClient.createDeployment();
        runtimeClient.createService();
    }

    public int getTotalLauncherCount() {
        return this.runtimeClient.getDeployments().size();
    }
}
