package org.ballerinalang.platform.playground.controller.jobs;

import org.ballerinalang.platform.playground.controller.scaling.LauncherAutoscaler;

public class IdleLauncherCheckJob implements Runnable {

    private int minCount;
    private int idleTimeout;
    private int limitGap;

    private LauncherAutoscaler autoscaler;

    public IdleLauncherCheckJob(int idleTimeout, int minCount, int limitGap, LauncherAutoscaler autoscaler) {
        this.idleTimeout = idleTimeout;
        this.minCount = minCount;
        this.limitGap = limitGap;
        this.autoscaler = autoscaler;
    }

    @Override
    public void run() {

    }
}
