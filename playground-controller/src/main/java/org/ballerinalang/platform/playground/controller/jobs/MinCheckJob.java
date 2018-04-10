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
        while (getTotalCount() < minCount) {
            log.debug("Scaling up as [Total Count] " + " is lower than the specified [Min Count] " + minCount);
            autoscaler.scaleUp();
        }
    }

    private int getTotalCount() {
        return 0;
    }
}
