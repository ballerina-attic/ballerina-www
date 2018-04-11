package org.ballerinalang.platform.playground.controller.service;

import org.ballerinalang.platform.playground.controller.persistence.Persistence;
import org.ballerinalang.platform.playground.controller.scaling.LauncherAutoscaler;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class ControllerServiceManager {
    private static final Logger log = LoggerFactory.getLogger(ControllerServiceManager.class);

    private Persistence persistence;
    private int maxCount;
    private int freeGap;
    private LauncherAutoscaler autoscaler;

    public ControllerServiceManager(int maxCount, int freeGap, LauncherAutoscaler autoscaler, Persistence persistence) {
        this.persistence = persistence;
        this.maxCount = maxCount;
        this.freeGap = freeGap;
        this.autoscaler = autoscaler;

        if (persistence.getTotalLauncherUrls().size() == 0){
            log.info("Initializing launcher list with any found existing launchers as free ones...");

            List<String> deployments = autoscaler.getDeployments();
            for (String deployment: deployments                 ) {
                persistence.addFreeLauncher(deployment + "." + Constants.DOMAIN_PLAYGROUND_BALLERINA_IO);
            }
        }
    }

    public String allocateFreeLauncher() {
        log.info("Looking for free Launchers to allocate...");
        List<String> freeLaunchers = persistence.getFreeLauncherUrls();

        if (freeLaunchers == null || freeLaunchers.size() == 0) {
            log.warn("No free launchers available. Increase Max Launcher Count.");

            return null;
        }

        String launcherToAllocate = freeLaunchers.get(0);
        persistence.markLauncherAsBusy(launcherToAllocate);

        log.debug("Allocating launcher URL: " + launcherToAllocate + "...");
        return launcherToAllocate;
    }

    public boolean markLauncherFree(String launcherUrl) {
        if (!persistence.launcherExists(launcherUrl)) {
            log.warn("Member [URL] " + launcherUrl + " not found.");
            return false;
        }

        log.info("Marking member [URL] " + launcherUrl + " as free...");
        persistence.markLauncherAsFree(launcherUrl);

        return true;
    }

    public boolean launcherExists(String launcherUrl) {
        return persistence.launcherExists(launcherUrl);
    }

    public boolean markLauncherBusy(String launcherUrl) {
        if (!persistence.launcherExists(launcherUrl)) {
            log.warn("Member [URL] " + launcherUrl + " not found.");
            return false;
        }

        log.info("Marking member [URL] " + launcherUrl + " as busy...");
        persistence.markLauncherAsBusy(launcherUrl);

        return true;
    }
}
