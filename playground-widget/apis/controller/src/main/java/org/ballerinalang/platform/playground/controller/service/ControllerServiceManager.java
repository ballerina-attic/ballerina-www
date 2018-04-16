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

package org.ballerinalang.platform.playground.controller.service;

import org.ballerinalang.platform.playground.controller.scaling.LauncherClusterManager;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.ballerinalang.platform.playground.utils.EnvUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class ControllerServiceManager {
    private static final Logger log = LoggerFactory.getLogger(ControllerServiceManager.class);

    private LauncherClusterManager clusterManager;

    public ControllerServiceManager(LauncherClusterManager clusterManager) {
        this.clusterManager = clusterManager;
    }

    String allocateFreeLauncher() {
        log.info("Looking for free Launchers to allocate...");
        List<String> freeLaunchers = clusterManager.getFreeLaunchers();

        if (freeLaunchers == null || freeLaunchers.size() == 0) {
            log.error("No free launchers available. Increase Max Launcher Count.");

            return null;
        }

        // Get a launcher URL and mark it as busy
        String launcherToAllocate = freeLaunchers.get(0);
        clusterManager.markLauncherAsBusy(launcherToAllocate);

        // Scale check and scale up if needed
        clusterManager.honourFreeBufferCount();

        log.info("Allocating launcher URL: " + launcherToAllocate + "...");
        return launcherToAllocate;
    }

    boolean markLauncherFree(String launcherSubDomain) {
        return clusterManager.markLauncherAsFreeBySubDomain(launcherSubDomain);
    }

    boolean markLauncherBusy(String launcherSubDomain) {
        return clusterManager.markLauncherAsBusyBySubDomain(launcherSubDomain);
    }

    public String getCacheResponderUrl() {
        String cacheResponderSubDomain = "cache";
        String rootDomainName = EnvUtils.getRequiredEnvStringValue(Constants.ENV_ROOT_DOMAIN_NAME);

        return cacheResponderSubDomain + "." + rootDomainName;
    }
}
