package org.ballerinalang.platform.playground.controller.autoscaler;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class LauncherReplicationController {

    private static final Logger log = LoggerFactory.getLogger(LauncherReplicationController.class);

    // control flags to be set using environment variables
    private static int minCount = LauncherReplicationController.getEnvIntValue("BPG_AS_MIN");
    private static int maxCount = LauncherReplicationController.getEnvIntValue("BPG_AS_MAX");
    private static int stepUp = LauncherReplicationController.getEnvIntValue("BPG_AS_STEP_UP");
    private static int stepDown = LauncherReplicationController.getEnvIntValue("BPG_AS_STEP_DOWN");
    private static int limitGap = LauncherReplicationController.getEnvIntValue("BPG_AS_LIMIT_GAP");
    private static int idleTimeoutSeconds = LauncherReplicationController.getEnvIntValue("BPG_AS_IDLE_TIMEOUT");

    static void doScaling(int totalCount, int freeCount) {
        int busyCount = totalCount - freeCount;

        while (totalCount < minCount) {
            log.debug("Scaling up as [Total Count] " + " is lower than the specified [Min Count] " + minCount);
            scaleUp();
        }

        while (freeCount < limitGap) {
            log.debug("Scaling up as [Free Count] " + freeCount + " is less than the specified [Limit Gap] " + limitGap);
            scaleUp();
        }

        while (totalCount > maxCount) {
            log.debug("Scaling down as [Total Count] " + totalCount + " is larger than the specified [Max Count] " + maxCount);
            scaleDown();
        }
    }

    private static void scaleDown() {
        // TODO: scale down by 1xstepDown at a time
    }

    private static void scaleUp() {
        // TODO: scale up by 1xscaleUp at a time
    }

    private static int getEnvIntValue(String key) {
        if (key != null) {
            String rawValue = System.getenv(key);
            if (rawValue != null) {
                try {
                    return Integer.parseInt(rawValue);
                } catch (NumberFormatException e) {
                    log.warn("Couldn't parse value set for environment variable " + key);
                    return 0;
                }
            } else {
                log.warn("No value found for environment variable " + key);
                return 0;
            }
        } else {
            log.debug("Null key queried for environment variables");
            return 0;
        }
    }
}
