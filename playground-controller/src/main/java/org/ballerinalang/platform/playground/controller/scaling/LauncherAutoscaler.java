package org.ballerinalang.platform.playground.controller.scaling;


import org.ballerinalang.platform.playground.controller.util.Constants;
import org.ballerinalang.platform.playground.controller.util.ContainerRuntimeClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

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
        log.info("Scaling up by [Step Up] " + stepUp + " instances...");

        // Where to start naming things
        int newNameSuffix = getLatestDeploymentNameSuffix() + 1;

        // scale up by (1 x stepUp) at a time
        for (int i = 0; i < stepUp; i++) {
            runtimeClient.createDeployment(newNameSuffix);
            runtimeClient.createService(newNameSuffix);

            newNameSuffix++;
        }
    }

    private int getLatestDeploymentNameSuffix() {
        List<String> deploymentList = runtimeClient.getDeployments();
        if (deploymentList.size() > 0) {
            Collections.sort(deploymentList);
            String lastElement = deploymentList.get(deploymentList.size() - 1);
            String lastLauncherSuffix = lastElement.substring((Constants.BPG_APP_TYPE_LAUNCHER + "-").length(), lastElement.length());
            return Integer.parseInt(lastLauncherSuffix);
        }

        return 0;
    }

    public int getTotalLauncherCount() {
        return this.runtimeClient.getDeployments().size();
    }

    public List<String> getServiceList() {
        return runtimeClient.getServices();
    }

    public boolean deploymentExists(String deploymentName) {
        return runtimeClient.deploymentExists(deploymentName);
    }

    public void deleteService(String serviceName) {
        runtimeClient.deleteService(serviceName);
    }
}
