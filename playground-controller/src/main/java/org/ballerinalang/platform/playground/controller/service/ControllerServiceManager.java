package org.ballerinalang.platform.playground.controller.service;

import org.ballerinalang.platform.playground.controller.scaling.LauncherClusterManager;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class ControllerServiceManager {
    private static final Logger log = LoggerFactory.getLogger(ControllerServiceManager.class);

    private int maxCount;
    private int freeGap;
    private LauncherClusterManager clusterManager;

    public ControllerServiceManager(int maxCount, int freeGap, LauncherClusterManager clusterManager) {
        this.maxCount = maxCount;
        this.freeGap = freeGap;
        this.clusterManager = clusterManager;

        if (clusterManager.getTotalLauncherCount() == 0) {
            log.info("Initializing launcher list with any found existing launchers as free ones...");

            List<String> deployments = clusterManager.getDeployments();
            for (String deployment : deployments) {
                clusterManager.addFreeLauncher(deployment + "." + Constants.DOMAIN_PLAYGROUND_BALLERINA_IO);
            }
        }
    }

    public String allocateFreeLauncher() {
        log.info("Looking for free Launchers to allocate...");
        List<String> freeLaunchers = clusterManager.getFreeLaunchers();

        if (freeLaunchers == null || freeLaunchers.size() == 0) {
            log.warn("No free launchers available. Increase Max Launcher Count.");

            return null;
        }

        // Get a launcher URL and mark it as busy
        String launcherToAllocate = freeLaunchers.get(0);
        clusterManager.markLauncherAsBusy(launcherToAllocate);

        log.debug("Allocating launcher URL: " + launcherToAllocate + "...");
        return launcherToAllocate;
    }

    public boolean markLauncherFree(String launcherUrl) {
        if (!clusterManager.launcherExists(launcherUrl)) {
            log.warn("Member [URL] " + launcherUrl + " not found.");
            return false;
        }

        log.info("Marking member [URL] " + launcherUrl + " as free...");
        clusterManager.markLauncherAsFree(launcherUrl);

        return true;
    }

    public void markLauncherBusy(String launcherUrl) {
        if (!clusterManager.launcherExists(launcherUrl)) {
            log.warn("Member [URL] " + launcherUrl + " not found.");
            return;
        }

        log.info("Marking member [URL] " + launcherUrl + " as busy...");
        clusterManager.markLauncherAsBusy(launcherUrl);

    }

    public boolean launcherExists(String launcherUrl) {
        return clusterManager.launcherExists(launcherUrl);
    }
}
