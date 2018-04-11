package org.ballerinalang.platform.playground.controller.scaling;


import org.ballerinalang.platform.playground.controller.util.Constants;
import org.ballerinalang.platform.playground.controller.containercluster.ContainerRuntimeClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

public class LauncherAutoscaler {

    private static final Logger log = LoggerFactory.getLogger(LauncherAutoscaler.class);

    private int stepUp;
    private int stepDown;
    private int freeGap;
    private int maxCount;
    private ContainerRuntimeClient runtimeClient;

    public LauncherAutoscaler(int stepUp, int stepDown, int maxCount, int freeGap, ContainerRuntimeClient runtimeClient) {
        this.stepDown = stepDown;
        this.stepUp = stepUp;
        this.freeGap = freeGap;
        this.maxCount = maxCount;
        this.runtimeClient = runtimeClient;
    }

    public void doScaling(int freeCount) {
        // Check if there are enough free launchers
        while (freeCount < freeGap) {
            log.debug("Scaling UP: REASON -> [Free Count] " + freeCount + " < [Free Gap] " + freeGap);
            scaleUp();
        }

        // Check if max is exceeded
        int totalCount = this.getTotalLauncherCount();
        while (totalCount > maxCount) {
            log.debug("Scaling DOWN: REASON -> [Total Count] " + totalCount + " > [Max Count] " + maxCount);
            scaleDown();
        }
    }

    public void scaleDown() {
        log.info("Scaling down by [Step Down] " + stepDown + " instances...");
        // TODO: scale down by 1xstepDown at a time
        // TODO: delete latest, free launchers

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

    public List<String> getServices() {
        return runtimeClient.getServices();
    }

    public boolean deploymentExists(String deploymentName) {
        return runtimeClient.deploymentExists(deploymentName);
    }

    public void deleteService(String serviceName) {
        runtimeClient.deleteService(serviceName);
    }

    public List<String> getDeployments() {
        return runtimeClient.getDeployments();
    }
}
