package org.ballerinalang.platform.playground.controller.util;

import java.util.List;

public interface ContainerRuntimeClient {

    public void createDeployment(int deploymentNameSuffix);

    public void createService(int serviceNameSuffix);

    public void deleteDeployment(String deploymentName);

    public void deleteService(String serviceName);

    public List<String> getDeployments();

    public List<String> getServices();
}