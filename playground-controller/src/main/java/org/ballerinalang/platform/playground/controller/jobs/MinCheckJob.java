package org.ballerinalang.platform.playground.controller.jobs;

import org.ballerinalang.platform.playground.controller.scaling.LauncherAutoscaler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MinCheckJob implements Runnable {

    private static final Logger log = LoggerFactory.getLogger(MinCheckJob.class);

    private int minCount;
    private LauncherAutoscaler autoscaler;

    public MinCheckJob(int minCount, LauncherAutoscaler autoscaler) {
        this.minCount = minCount;
        this.autoscaler = autoscaler;
    }

    @Override
    public void run() {
        int totalLauncherCount = autoscaler.getTotalLauncherCount();
        log.debug("[Total count] " + totalLauncherCount + " [Min Count] " + minCount);
        while (totalLauncherCount < minCount) {
            log.info("Scaling UP: REASON -> [Total Count] " + totalLauncherCount + " < [Min Count] " + minCount);
            autoscaler.scaleUp();
            totalLauncherCount = autoscaler.getTotalLauncherCount();
        }
    }
}
