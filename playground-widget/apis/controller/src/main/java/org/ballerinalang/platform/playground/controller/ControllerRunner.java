package org.ballerinalang.platform.playground.controller;

import org.ballerinalang.platform.playground.controller.containercluster.ContainerRuntimeClient;
import org.ballerinalang.platform.playground.controller.containercluster.KubernetesClientImpl;
import org.ballerinalang.platform.playground.controller.persistence.RedisPersistence;
import org.ballerinalang.platform.playground.controller.scaling.LauncherClusterManager;
import org.ballerinalang.platform.playground.controller.service.ControllerService;
import org.ballerinalang.platform.playground.controller.service.ControllerServiceManager;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.ballerinalang.platform.playground.utils.EnvUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.msf4j.MicroservicesRunner;

public class ControllerRunner {

    private static final Logger log = LoggerFactory.getLogger(ControllerRunner.class);

    public static void main(String[] args) {
        // Read controller role
        String controllerRole = EnvUtils.getEnvStringValue(Constants.ENV_CONTROLLER_ROLE);

        if (controllerRole == null) {
            log.error("Controller role is not specified. Use environment variable \"" + Constants.ENV_CONTROLLER_ROLE + "\" to set a role.");
            throw new IllegalArgumentException("Controller role is not specified.");
        }

        log.info("Starting Ballerina Playground Controller with role: " + controllerRole + "...");

        // Read control flags
        String bpgNamespace = EnvUtils.getEnvStringValue(Constants.ENV_BPG_NAMESPACE);
        String launcherImageName = EnvUtils.getEnvStringValue(Constants.ENV_LAUNCHER_IMAGE_NAME);
        String nfsServerIP = EnvUtils.getEnvStringValue(Constants.ENV_BGP_NFS_SERVER_IP);

        int stepUp = EnvUtils.getEnvIntValue(Constants.ENV_STEP_UP);
        int stepDown = EnvUtils.getEnvIntValue(Constants.ENV_STEP_DOWN);
        int desiredCount = EnvUtils.getEnvIntValue(Constants.ENV_DESIRED_COUNT);
        int maxCount = EnvUtils.getEnvIntValue(Constants.ENV_MAX_COUNT);
        int freeBufferCount = EnvUtils.getEnvIntValue(Constants.ENV_FREE_BUFFER);

        // Create a k8s client to interact with the k8s API. The client is per namespace
        log.info("Creating Kubernetes client...");
        ContainerRuntimeClient runtimeClient = new KubernetesClientImpl(bpgNamespace, launcherImageName, nfsServerIP);

        // Create a cluster mgt instance to scale in/out launcher instances
        log.info("Creating Cluster Manager...");
        LauncherClusterManager clusterManager = new LauncherClusterManager(desiredCount, maxCount, stepUp, stepDown, freeBufferCount,
                runtimeClient, new RedisPersistence());

        // Perform role
        switch (controllerRole) {
            case Constants.CONTROLLER_ROLE_DESIRED_COUNT_CHECK:
                clusterManager.cleanOrphanServices();
                clusterManager.cleanOrphanDeployments();
                clusterManager.honourDesiredCount();

                break;
            case Constants.CONTROLLER_ROLE_MAX_COUNT_CHECK:
                clusterManager.honourMaxCount();

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
}
