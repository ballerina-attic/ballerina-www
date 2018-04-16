/*
 * Copyright (c) 2018, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
        String controllerRole = EnvUtils.getRequiredEnvStringValue(Constants.ENV_CONTROLLER_ROLE);

        log.info("Starting Ballerina Playground Controller with role: " + controllerRole + "...");

        // Read control flags
        String bpgNamespace = EnvUtils.getEnvStringValue(Constants.ENV_BPG_NAMESPACE, Constants.DEFAULT_BALLERINA_PLAYGROUND_NAMESPACE);
        String launcherImageName = EnvUtils.getRequiredEnvStringValue(Constants.ENV_LAUNCHER_IMAGE_NAME);
        String nfsServerIP = EnvUtils.getRequiredEnvStringValue(Constants.ENV_BGP_NFS_SERVER_IP);
        String rootDomainName = EnvUtils.getEnvStringValue(Constants.ENV_ROOT_DOMAIN_NAME, Constants.DEFAULT_ROOT_DOMAIN_NAME);

        // Auto scaling factors are defaulted to test values
        int stepUp = EnvUtils.getEnvIntValue(Constants.ENV_STEP_UP, 2);
        int stepDown = EnvUtils.getEnvIntValue(Constants.ENV_STEP_DOWN, 1);
        int desiredCount = EnvUtils.getEnvIntValue(Constants.ENV_DESIRED_COUNT, 5);
        int maxCount = EnvUtils.getEnvIntValue(Constants.ENV_MAX_COUNT, 10);
        int freeBufferCount = EnvUtils.getEnvIntValue(Constants.ENV_FREE_BUFFER, 2);

        // Create a k8s client to interact with the k8s API. The client is per namespace
        log.info("Creating Kubernetes client...");
        ContainerRuntimeClient runtimeClient = new KubernetesClientImpl(bpgNamespace, launcherImageName,
                nfsServerIP, rootDomainName);

        // Create a cluster mgt instance to scale in/out launcher instances
        log.info("Creating Cluster Manager...");
        LauncherClusterManager clusterManager = new LauncherClusterManager(desiredCount, maxCount, stepUp, stepDown, freeBufferCount,
                rootDomainName, runtimeClient, new RedisPersistence());

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
            case Constants.CONTROLLER_ROLE_URL_VALIDATOR:
                clusterManager.validateLauncherUrls();

                break;
            case Constants.CONTROLLER_ROLE_EVENT_WATCHER:
                clusterManager.watchAndClean();

                break;
            case Constants.CONTROLLER_ROLE_API_SERVER:
                log.info("Checking for desired count of deployments...");
                clusterManager.cleanOrphanDeployments();
                clusterManager.cleanOrphanServices();
                clusterManager.honourDesiredCount();

                log.info("Starting API server...");
                ControllerServiceManager serviceManager = new ControllerServiceManager(clusterManager);
                MicroservicesRunner microservicesRunner = new MicroservicesRunner();
                microservicesRunner.deploy(new ControllerService(serviceManager));
                microservicesRunner.start();

                break;
            default:
                // break down if an invalid role is specified
                throw new IllegalArgumentException("Invalid Controller Role defined: " + controllerRole);
        }
    }
}
