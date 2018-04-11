package org.ballerinalang.platform.playground.controller.scaling;


import org.ballerinalang.platform.playground.controller.containercluster.ContainerRuntimeClient;
import org.ballerinalang.platform.playground.controller.containercluster.model.Deployment;
import org.ballerinalang.platform.playground.controller.persistence.Persistence;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

public class LauncherClusterManager {

    private static final Logger log = LoggerFactory.getLogger(LauncherClusterManager.class);

    private int stepUp;
    private int stepDown;
    private int freeGap;
    private int maxCount;
    private ContainerRuntimeClient runtimeClient;
    private Persistence persistence;

    public LauncherClusterManager(int stepUp, int stepDown, int maxCount, int freeGap, ContainerRuntimeClient runtimeClient, Persistence persistence) {
        this.stepDown = stepDown;
        this.stepUp = stepUp;
        this.freeGap = freeGap;
        this.maxCount = maxCount;
        this.runtimeClient = runtimeClient;
        this.persistence = persistence;
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

        List<String> urlsToScaleDown = persistence.getFreeLauncherUrls();

        for (int i = 0; i < stepDown; i++) {
            Collections.sort(urlsToScaleDown);
            String launcherUrlToDelete = urlsToScaleDown.get(urlsToScaleDown.size() - 1);

            // TODO: remove launcher from list

            String deploymentName = getDeploymentNameFromUrl(launcherUrlToDelete);

            runtimeClient.deleteService(deploymentName);
            runtimeClient.deleteDeployment(deploymentName);
        }
        // TODO: scale down by 1xstepDown at a time
        // TODO: delete latest, free launchers

    }

    public void scaleUp() {
        log.info("Scaling up by [Step Up] " + stepUp + " instances...");

        // Where to start naming things
        int newNameSuffix = getLatestDeploymentNameSuffix() + 1;

        // scale up by (1 x stepUp) at a time
        for (int i = 0; i < stepUp; i++) {
            runtimeClient.createDeployment(newNameSuffix + i);
            runtimeClient.createService(newNameSuffix + i);
        }
    }

    private String getDeploymentNameFromUrl(String launchUrl) {
        if (launchUrl != null) {
            String subdomain = launchUrl.split(".")[0];
            String domainNameSuffix = subdomain.substring((Constants.LAUNCHER_URL_PREFIX + "-").length());

            return Constants.BPG_APP_TYPE_LAUNCHER + "-" + domainNameSuffix;
        }

        throw new IllegalArgumentException("Null launcher URL cannot be processed.");
    }

    private int getLatestDeploymentNameSuffix() {
//        List<Deployment> deploymentList = runtimeClient.getDeployments();
//        if (deploymentList.size() > 0) {
//            Collections.sort(deploymentList);
//            String lastElementName = deploymentList.get(deploymentList.size() - 1).getName();
//            String lastLauncherSuffix = lastElementName.substring((Constants.BPG_APP_TYPE_LAUNCHER + "-").length());
//
//            return Integer.parseInt(lastLauncherSuffix);
//        }
//
//        return 0;

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

    public Deployment getDeploymentByName(String deploymentName) {
        return runtimeClient.getDeploymentByName(deploymentName);
    }

    public void addFreeLauncher(String launcherUrl) {
        persistence.addFreeLauncher(launcherUrl);
    }

    public List<String> getFreeLaunchers() {
        return persistence.getFreeLauncherUrls();
    }

    public void markLauncherAsBusy(String launcherToAllocate) {
        persistence.markLauncherAsBusy(launcherToAllocate);
    }

    public boolean launcherExists(String launcherUrl) {
        return persistence.launcherExists(launcherUrl);
    }

    public void markLauncherAsFree(String launcherUrl) {
        persistence.markLauncherAsFree(launcherUrl);
    }

    public int getFreeLauncherCount() {
        return persistence.getFreeLauncherUrls().size();
    }
}
