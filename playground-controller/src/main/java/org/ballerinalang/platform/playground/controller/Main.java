package org.ballerinalang.platform.playground.controller;

import org.ballerinalang.platform.playground.controller.persistence.InMemoryPersistence;
import org.ballerinalang.platform.playground.controller.persistence.Persistence;
import org.ballerinalang.platform.playground.controller.scaling.LauncherAutoscaler;
import org.ballerinalang.platform.playground.controller.service.ControllerService;
import org.ballerinalang.platform.playground.controller.service.ControllerServiceManager;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.ballerinalang.platform.playground.controller.containercluster.ContainerRuntimeClient;
import org.ballerinalang.platform.playground.controller.containercluster.KubernetesClientImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.msf4j.MicroservicesRunner;

import java.util.List;

public class Main {

    private static final Logger log = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        // Read controller role
        String controllerRole = getEnvStringValue(Constants.ENV_CONTROLLER_ROLE);

        if (controllerRole == null) {
            log.error("Controller role is not specified. Use environment variable \"" + Constants.ENV_CONTROLLER_ROLE + "\" to set a role.");
            throw new IllegalArgumentException("Controller role is not specified.");
        }

        log.info("Starting Ballerina Playground Controller with role: " + controllerRole + "...");

        // Read control flags
        String bpgNamespace = getEnvStringValue(Constants.ENV_BPG_NAMESPACE);
        String launcherImageName = getEnvStringValue(Constants.ENV_LAUNCHER_IMAGE_NAME);
        int stepUp = getEnvIntValue(Constants.ENV_STEP_UP);
        int stepDown = getEnvIntValue(Constants.ENV_STEP_DOWN);
        int minCount = getEnvIntValue(Constants.ENV_MIN_COUNT);
        int maxCount = getEnvIntValue(Constants.ENV_MAX_COUNT);
        int freeGap = getEnvIntValue(Constants.ENV_FREE_GAP);
        int idleTimeoutMinutes = getEnvIntValue(Constants.ENV_IDLE_TIMEOUT);

        // Create a k8s client to interact with the k8s API. The client is per namespace
        log.debug("Creating Kubernetes client...");
        ContainerRuntimeClient runtimeClient = new KubernetesClientImpl(bpgNamespace, launcherImageName);

        // Create a autoscaler instance to scale in/out launcher instances
        log.debug("Creating autoscaler...");
        LauncherAutoscaler autoscaler = new LauncherAutoscaler(stepUp, stepDown, maxCount, freeGap, runtimeClient);

        // Perform role
        switch (controllerRole) {
            case Constants.CONTROLLER_ROLE_MIN_CHECK:
                log.info("Checking minimum instance count...");
                cleanOrphanServices(autoscaler);
                runMinCheck(minCount, autoscaler);

                break;
            case Constants.CONTROLLER_ROLE_IDLE_CHECK:
                log.info("Checking for idle launchers...");
                runIdleCheck(idleTimeoutMinutes, minCount, freeGap, autoscaler);

                break;
            case Constants.CONTROLLER_ROLE_API_SERVER:
                Persistence persistence = new InMemoryPersistence();
                ControllerServiceManager serviceManager = new ControllerServiceManager(maxCount, freeGap, autoscaler, persistence);

                log.info("Starting API server...");
                MicroservicesRunner microservicesRunner = new MicroservicesRunner();
                microservicesRunner.deploy(new ControllerService(serviceManager));
                microservicesRunner.start();

                break;
            default:
                // break down if an invalid role is specified
                log.error("Invalid Controller Role defined: " + controllerRole);
                throw new IllegalArgumentException("Invalid Controller Role defined: " + controllerRole);
        }
    }

    private static void cleanOrphanServices(LauncherAutoscaler autoscaler) {
        List<String> serviceNames = autoscaler.getServices();
        for (String serviceName : serviceNames) {
            if (serviceName.startsWith(Constants.BPG_APP_TYPE_LAUNCHER + "-") && !autoscaler.deploymentExists(serviceName)) {
                log.info("Cleaning orphan Service [Name] " + serviceName + "...");
                autoscaler.deleteService(serviceName);
            }
        }
    }

    private static void runIdleCheck(int idleTimeoutMinutes, int minCount, int limitGap, LauncherAutoscaler autoscaler) {
        // TODO: To test this functionality, the list implementation should be completed.
    }

    private static void runMinCheck(int minCount, LauncherAutoscaler autoscaler) {
        int totalLauncherCount = autoscaler.getTotalLauncherCount();
        log.info("[Total count] " + totalLauncherCount + " [Min Count] " + minCount);
        while (totalLauncherCount < minCount) {
            log.info("Scaling UP: REASON -> [Total Count] " + totalLauncherCount + " < [Min Count] " + minCount);
            autoscaler.scaleUp();
            totalLauncherCount = autoscaler.getTotalLauncherCount();
        }
    }

    private static String getEnvStringValue(String key) {
        if (key != null) {
            return System.getenv(key);
        } else {
            log.debug("Null key queried for environment variable");
            return null;
        }
    }


    private static int getEnvIntValue(String key) {
        String rawValue = getEnvStringValue(key);
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
    }
}
