package org.ballerinalang.platform.playground.controller.service;

import org.ballerinalang.platform.playground.controller.scaling.LauncherClusterManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class ControllerServiceManager {
    private static final Logger log = LoggerFactory.getLogger(ControllerServiceManager.class);

    private LauncherClusterManager clusterManager;

    public ControllerServiceManager(LauncherClusterManager clusterManager) {
        this.clusterManager = clusterManager;
    }

    String allocateFreeLauncher() {
        log.info("Looking for free Launchers to allocate...");
        List<String> freeLaunchers = clusterManager.getFreeLaunchers();

        if (freeLaunchers == null || freeLaunchers.size() == 0) {
            log.warn("No free launchers available. Increase Max Launcher Count.");

            return null;
        }

        // Get a launcher URL and mark it as busy
        String launcherToAllocate = freeLaunchers.get(0);
        clusterManager.markLauncherAsBusy(launcherToAllocate);

        // Scale check and scale up if needed
        clusterManager.honourFreeBufferCount();

        log.info("Allocating launcher URL: " + launcherToAllocate + "...");
        return launcherToAllocate;
    }

    boolean markLauncherFree(String launcherUrl) {
        return clusterManager.markLauncherAsFree(launcherUrl);
    }

    boolean markLauncherBusy(String launcherUrl) {
        return clusterManager.markLauncherAsBusy(launcherUrl);
    }

    public String getCacheResponderUrl() {
        return ""; //TODO
    }
}
