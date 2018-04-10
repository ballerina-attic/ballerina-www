package org.ballerinalang.platform.playground.controller.autoscaler;

public class IdleLauncherController implements Runnable {

    private int minCount;
    private int idleTimeout;
    private int limitGap;

    public IdleLauncherController(int idleTimeout, int minCount, int limitGap) {
        this.idleTimeout = idleTimeout;
        this.minCount = minCount;
        this.limitGap = limitGap;
    }

    @Override
    public void run() {

    }
}
