package org.ballerinalang.platform.playground.controller.containercluster;

import org.ballerinalang.platform.playground.controller.containercluster.model.Deployment;

import java.util.List;

public interface ContainerRuntimeClient {

    public void createDeployment(int deploymentNameSuffix);

    public void createService(int serviceNameSuffix);

    public void deleteDeployment(String deploymentName);

    public void deleteService(String serviceName);

    public List<String> getDeployments();

    public List<String> getServices();

    public boolean deploymentExists(String deploymentName);

    public boolean serviceExists(String serviceName);

    public Deployment getDeploymentByName(String deploymentName);
}