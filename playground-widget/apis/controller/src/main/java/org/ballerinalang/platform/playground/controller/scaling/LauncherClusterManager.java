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

package org.ballerinalang.platform.playground.controller.scaling;

import org.ballerinalang.platform.playground.controller.containercluster.ContainerRuntimeClient;
import org.ballerinalang.platform.playground.controller.persistence.Persistence;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;

public class LauncherClusterManager {

    private static final Logger log = LoggerFactory.getLogger(LauncherClusterManager.class);

    private int stepUp;
    private int stepDown;
    private int freeBufferCount;
    private int maxCount;
    private int desiredCount;
    private String rootDomainName;
    private ContainerRuntimeClient runtimeClient;
    private Persistence persistence;

    public LauncherClusterManager(int desiredCount, int maxCount, int stepUp, int stepDown,
                                  int freeBufferCount, String rootDomainName, ContainerRuntimeClient runtimeClient,
                                  Persistence persistence) {

        this.stepDown = stepDown;
        this.stepUp = stepUp;
        this.freeBufferCount = freeBufferCount;
        this.maxCount = maxCount;
        this.desiredCount = desiredCount;
        this.rootDomainName = rootDomainName;
        this.runtimeClient = runtimeClient;
        this.persistence = persistence;

        // If there are no launcher URLs in the persistence, try to collect any running valid launchers.
        if (getTotalLaunchers().size() == 0) {
            log.info("Initializing launcher list with any found existing launchers as free ones...");

            addAllDeploymentsAsFreeLaunchers();
        }
    }

    public void scaleDown() {
        log.info("Scaling down by [Step Down] " + stepDown + " instances...");

        List<String> urlsToScaleDown = getFreeLaunchers();

        // Scale down by (1 x stepDown) at a time
        for (int i = 0; i < stepDown; i++) {
            // Get the youngest free launcher URL
            Collections.sort(urlsToScaleDown);
            String launcherUrlToDelete = urlsToScaleDown.get(urlsToScaleDown.size() - 1);

            log.info("Cutting down [Launcher URL] " + launcherUrlToDelete + "...");

            // Get object name from launcher URL
            String deploymentName = getObjectNameFromLauncherUrl(launcherUrlToDelete);

            // Delete deployment and service
            if (!deleteLauncher(deploymentName)) {
                log.error("Launcher deletion failed [Object Name] " + deploymentName);
            }
        }
    }

    public void scaleUp(String reason) {
        log.info("Scaling up by [Step Up] " + stepUp + " instances...");

        // Where to start naming things
        int newNameSuffix = getLatestDeploymentNameSuffix() + 1;

        // scale up by (1 x stepUp) at a time
        for (int i = 0; i < stepUp; i++) {
            int deploymentNameSuffix = newNameSuffix + i;
            String deploymentName = Constants.BPG_APP_TYPE_LAUNCHER + "-" + deploymentNameSuffix;
            if (createLauncher(deploymentNameSuffix, reason)) {
                // Register the newly spawned launcher as a free one
                addFreeLauncher(deploymentName);
            } else {
                log.error("Launcher creation failed for [Object Name] " + deploymentName);
            }

        }
    }

    public void honourMaxCount() {
        // Get free and total counts
        int freeCount = getFreeLaunchers().size();
        int totalCount = getTotalLaunchers().size();

        // Scale down if max is exceeded, irrespective of free buffer count
        if (totalCount > maxCount) {
            log.info("Scaling DOWN: REASON -> [Total Count] " + totalCount + " > [Max Count] " + maxCount);
            scaleDown();
            return;
        }

        // Don't scale down if there are not enough free launchers
        if (freeCount <= freeBufferCount) {
            log.info("Not scaling down since [Free Count] " + freeCount + " <= [Free Buffer Size] " +
                    freeBufferCount + "...");
            return;
        }

        // Don't scale down if the desired count is not exceeded
        if (totalCount <= desiredCount) {
            log.info("Not scaling down since [Total Count] " + totalCount + " <= [Desired Count] " +
                    desiredCount + "...");
            return;
        }

        // Scale down if desired count is exceeded, but with more free launchers than buffer count by stepDown count
        if ((freeCount + stepDown) >= freeBufferCount) {
            log.info("Scaling DOWN: REASON -> [Total Count] " + totalCount + " > [Desired Count] " + maxCount +
                    " AND [Free Count] + [Step Down] " + freeCount + " + " + stepDown +
                    " >= [Free Buffer Count] " + freeBufferCount);

            scaleDown();
            return;
        }

        // If after scaling down there wouldn't be enough free launchers, don't scale down
        log.info("Not scaling down since [Free Count] + [Step Down] " + freeCount + " + " + stepDown +
                " < [Free Buffer Count] " + freeBufferCount);
    }

    public void honourDesiredCount() {
        int totalDeploymentCount = getDeployments().size();
        log.info("[Total count] " + totalDeploymentCount + " [Desired Count] " + desiredCount);

        while (totalDeploymentCount < desiredCount) {
            log.info("Scaling UP: REASON -> [Total Count] " + totalDeploymentCount + " < [Desired Count] " +
                    desiredCount);

            scaleUp("honourDesiredCount");
            totalDeploymentCount = getDeployments().size();
        }
    }

    public void honourFreeBufferCount() {
        // Check if there are enough free launchers
        int freeCount = getFreeLaunchers().size();

        while (freeCount < freeBufferCount) {
            log.info("Scaling UP: REASON -> [Free Count] " + freeCount + " < [Free Gap] " + freeBufferCount);
            scaleUp("honourFreeBufferCount");
        }
    }

    public void cleanOrphanServices() {
        log.info("Cleaning orphan Services...");
        List<String> serviceNames = getServices();
        for (String serviceName : serviceNames) {
            if (serviceName.startsWith(Constants.BPG_APP_TYPE_LAUNCHER + "-") && !deploymentExists(serviceName)) {
                log.info("Cleaning orphan Service [Name] " + serviceName + "...");

                unregisterLauncherIfExistsByObjectName(serviceName);

                if (!runtimeClient.deleteService(serviceName)) {
                    log.error("Service deletion failed [Service Name] " + serviceName);
                }
            }
        }
    }

    public void cleanOrphanDeployments() {
        log.info("Cleaning orphan Deployments...");
        List<String> deploymentNames = getDeployments();
        for (String deploymentName : deploymentNames) {
            if (deploymentName.startsWith(Constants.BPG_APP_TYPE_LAUNCHER + "-") && !serviceExists(deploymentName)) {
                log.info("Cleaning orphan Deployment [Name] " + deploymentName + "...");

                unregisterLauncherIfExistsByObjectName(deploymentName);

                if (!runtimeClient.deleteDeployment(deploymentName)) {
                    log.error("Deployment deletion failed [Deployment Name] " + deploymentName);
                }
            }
        }
    }

    public void validateLauncherUrls() {
        log.info("Validating the existing launcher URL list for missing deployments...");

        for (String launcherUrl : getTotalLaunchers()) {
            log.info("Validating [Launcher URL] " + launcherUrl + "...");
            String objectName = getObjectNameFromLauncherUrl(launcherUrl);
            if (!runtimeClient.deploymentExists(objectName) || !runtimeClient.serviceExists(objectName)) {
                log.info("Found an invalid launcher [URL] " + launcherUrl);
                // Just remove the reference to launcher now
                // cleanOrphan* jobs will clean any orphan deployments
                // desired count check will scale up if free count is reduced
                unregisterLauncherIfExists(launcherUrl);
            }
        }
    }

    public List<String> getServices() {
        return runtimeClient.getServices();
    }

    public List<String> getDeployments() {
        return runtimeClient.getDeployments();
    }

    public boolean deploymentExists(String deploymentName) {
        return runtimeClient.deploymentExists(deploymentName);
    }

    public boolean serviceExists(String serviceName) {
        return runtimeClient.serviceExists(serviceName);
    }

    private void addAllDeploymentsAsFreeLaunchers() {
        List<String> deployments = getDeployments();
        log.info("Found " + deployments.size() + " deployments to be added");
        for (String deployment : deployments) {
            if (runtimeClient.serviceExists(deployment)){
                addFreeLauncher(deployment);
            } else{
                log.info("Deployment " + deployment + " doesn't have a Service that exposes it. Not adding as a launcher...");
            }
        }
    }

    public List<String> getFreeLaunchers() {
        return persistence.getFreeLauncherUrls();
    }

    public List<String> getTotalLaunchers() {
        return persistence.getTotalLauncherUrls();
    }

    public boolean markLauncherAsBusy(String launcherUrl) {
        if (persistence.launcherExists(launcherUrl)) {
            return persistence.markLauncherAsBusy(launcherUrl);
        }

        return false;
    }

    public boolean markLauncherAsFree(String launcherUrl) {
        if (persistence.launcherExists(launcherUrl)) {
            return persistence.markLauncherAsFree(launcherUrl);
        }

        return false;
    }

    private boolean deleteLauncher(String deploymentName) {
        unregisterLauncherIfExistsByObjectName(deploymentName);

        boolean svcDeleted = runtimeClient.deleteService(deploymentName);
        boolean depDeleted = runtimeClient.deleteDeployment(deploymentName);

        return svcDeleted && depDeleted;
    }

    private void unregisterLauncherIfExistsByObjectName(String objectName) {
        // Unregister from launcher list
        String launcherUrl = getLauncherUrlFromObjectName(objectName);
        unregisterLauncherIfExists(launcherUrl);
    }

    private void unregisterLauncherIfExists(String launcherUrl) {
        log.info("Unregistering launcher [URL] " + launcherUrl);
        if (persistence.launcherExists(launcherUrl)) {
            persistence.unregisterLauncher(launcherUrl);
        } else {
            log.debug("Launcher URL not found: " + launcherUrl);
        }
    }

    private boolean createLauncher(int deploymentNameSuffix, String reason) {
        boolean depCreated = runtimeClient.createDeployment(deploymentNameSuffix, reason);
        boolean svcCreated = runtimeClient.createService(deploymentNameSuffix, reason);

        return depCreated && svcCreated;
    }

    private void addFreeLauncher(String deploymentName) {
        persistence.addFreeLauncher(getLauncherUrlFromObjectName(deploymentName));
    }

    private String getObjectNameFromLauncherUrl(String launchUrl) {
        if (launchUrl != null) {
            String[] domainParts = launchUrl.split("\\.");
            return domainParts[0].replace(Constants.LAUNCHER_URL_PREFIX, Constants.BPG_APP_TYPE_LAUNCHER);
        }

        throw new IllegalArgumentException("Null launcher URL cannot be processed.");
    }

    private String getLauncherUrlFromObjectName(String objectName) {
        if (objectName != null) {
            return objectName.replace(Constants.BPG_APP_TYPE_LAUNCHER, Constants.LAUNCHER_URL_PREFIX) +
                    "." +
                    rootDomainName;
        }

        throw new IllegalArgumentException("Null Object name cannot be processed.");
    }

    private int getLatestDeploymentNameSuffix() {
        List<String> deploymentList = getDeployments();
        if (deploymentList.size() > 0) {
            Collections.sort(deploymentList);
            String lastElement = deploymentList.get(deploymentList.size() - 1);
            String lastLauncherSuffix = lastElement.substring(
                    (Constants.BPG_APP_TYPE_LAUNCHER + "-").length(),
                    lastElement.length());

            return Integer.parseInt(lastLauncherSuffix);
        }

        return 0;
    }
}
