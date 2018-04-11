package org.ballerinalang.platform.playground.controller;

import org.ballerinalang.platform.playground.controller.containercluster.ContainerRuntimeClient;
import org.ballerinalang.platform.playground.controller.containercluster.KubernetesClientImpl;
import org.ballerinalang.platform.playground.controller.persistence.InMemoryPersistence;
import org.ballerinalang.platform.playground.controller.scaling.LauncherClusterManager;
import org.ballerinalang.platform.playground.controller.service.ControllerService;
import org.ballerinalang.platform.playground.controller.service.ControllerServiceManager;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.msf4j.MicroservicesRunner;

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
        int desiredCount = getEnvIntValue(Constants.ENV_DESIRED_COUNT);
        int maxCount = getEnvIntValue(Constants.ENV_MAX_COUNT);
        int freeBufferCount = getEnvIntValue(Constants.ENV_FREE_BUFFER);

        // Create a k8s client to interact with the k8s API. The client is per namespace
        log.debug("Creating Kubernetes client...");
        ContainerRuntimeClient runtimeClient = new KubernetesClientImpl(bpgNamespace, launcherImageName);

        // Create a autoscaler instance to scale in/out launcher instances
        log.debug("Creating Cluster Manager...");
        LauncherClusterManager clusterManager = new LauncherClusterManager(desiredCount, maxCount, stepUp, stepDown, freeBufferCount,
                runtimeClient, new InMemoryPersistence());

        // Perform role
        switch (controllerRole) {
            case Constants.CONTROLLER_ROLE_MIN_CHECK:
                log.info("Checking minimum instance count...");
                clusterManager.cleanOrphanServices();
                // TODO: clean orphan deployments
                clusterManager.honourDesiredCount();

                break;
            case Constants.CONTROLLER_ROLE_IDLE_CHECK:
                log.info("Checking for idle launchers...");
                runScaleDownJob(maxCount, desiredCount, freeBufferCount, stepDown, clusterManager);

                break;
            case Constants.CONTROLLER_ROLE_API_SERVER:
                log.info("Starting API server...");
                ControllerServiceManager serviceManager = new ControllerServiceManager(clusterManager);
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

    private static void runScaleDownJob(int maxCount, int desiredCount, int freeBufferCount, int stepDown, LauncherClusterManager autoscaler) {
        // Get free and total counts
        int freeCount = autoscaler.getFreeLauncherCount();
        int totalCount = autoscaler.getTotalLauncherCount();

        // Scale down if max is exceeded, irrespective of free buffer count
        if (totalCount > maxCount) {
            log.info("Scaling DOWN: REASON -> [Total Count] " + totalCount + " > [Max Count] " + maxCount);
            autoscaler.scaleDown();
            return;
        }

        // Don't scale down if there are not enough free launchers
        if (freeCount <= freeBufferCount) {
            log.info("Not scaling down since [Free Count] " + freeCount + " <= [Free Buffer Size] " + freeBufferCount + "...");
            return;
        }

        // Don't scale down if the desired count is not exceeded
        if (totalCount <= desiredCount) {
            log.info("Not scaling down since [Total Count] " + totalCount + " <= [Desired Count] " + desiredCount + "...");
            return;
        }

        // Scale down if desired count is exceeded, but with more free launchers than buffer count by stepDown count
        if ((freeCount + stepDown) >= freeBufferCount) {
            log.info("Scaling DOWN: REASON -> [Total Count] " + totalCount + " > [Desired Count] " + maxCount +
                    " AND [Free Count] + [Step Down] " + freeCount + " + " + stepDown +
                    " >= [Free Buffer Count] " + freeBufferCount);

            autoscaler.scaleDown();
            return;
        }

        // If after scaling down there wouldn't be enough free launchers, do scale down
        log.info("Not scaling down since [Free Count] + [Step Down] " + freeCount + " + " + stepDown +
                " < [Free Buffer Count] " + freeBufferCount);
    }


    private static String getEnvStringValue(String key) {
        if (key != null) {
            return System.getenv(key);
        } else {
            log.warn("Null key queried for environment variable");
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
