package org.ballerinalang.platform.playground.controller;

import org.ballerinalang.platform.playground.controller.jobs.IdleLauncherCheckJob;
import org.ballerinalang.platform.playground.controller.scaling.LauncherAutoscaler;
import org.ballerinalang.platform.playground.controller.jobs.MinCheckJob;
import org.ballerinalang.platform.playground.controller.util.ContainerRuntimeClient;
import org.ballerinalang.platform.playground.controller.util.KubernetesClientImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.msf4j.MicroservicesRunner;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Main {

    private static final Logger log = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        // control flags to be set using environment variables
        int minCount = getEnvIntValue("BPG_SCALING_MIN");
        int maxCount = getEnvIntValue("BPG_SCALING_MAX");
        int stepUp = getEnvIntValue("BPG_SCALING_STEP_UP");
        int stepDown = getEnvIntValue("BPG_SCALING_STEP_DOWN");
        int limitGap = getEnvIntValue("BPG_SCALING_LIMIT_GAP");
        int idleTimeoutSeconds = getEnvIntValue("BPG_SCALING_IDLE_TIMEOUT");

        int idleCheckInitialDelay = 5;
        int idleCheckPeriod = 10;

        int minCheckInitialDelay = 5;
        int minCheckPeriod = 10;


        ContainerRuntimeClient runtimeClient = new KubernetesClientImpl();
        LauncherAutoscaler autoscaler = new LauncherAutoscaler(runtimeClient, stepUp, stepDown);

        // Schedule a periodic job to check for min count and scale up if needed
        ScheduledExecutorService minCheckExecutor = Executors.newScheduledThreadPool(1);
        minCheckExecutor.scheduleAtFixedRate(
                new MinCheckJob(minCount, autoscaler),
                minCheckInitialDelay,
                minCheckPeriod,
                TimeUnit.SECONDS);


        // Schedule a periodic job to check for idle launchers and kill them
        ScheduledExecutorService idleCheckExecutor = Executors.newScheduledThreadPool(1);
        idleCheckExecutor.scheduleAtFixedRate(
                new IdleLauncherCheckJob(idleTimeoutSeconds, minCount, limitGap, autoscaler),
                idleCheckInitialDelay,
                idleCheckPeriod,
                TimeUnit.SECONDS);

        // Start API server
        MicroservicesRunner microservicesRunner = new MicroservicesRunner();
        microservicesRunner.deploy(new TestControllerService(maxCount, limitGap, autoscaler));
        microservicesRunner.start();
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
