package org.ballerinalang.platform.playground.controller.util;

import java.util.List;

public interface ContainerRuntimeClient {

    public void createDeployment(String namespace);

    public void createService(String namespace);

    public void deleteDeployment(String namespace, String deploymentName);

    public void deleteService(String namespace, String serviceName);

    public List<String> getDeployments(String namespace);

    public List<String> getServices(String namespace);
}