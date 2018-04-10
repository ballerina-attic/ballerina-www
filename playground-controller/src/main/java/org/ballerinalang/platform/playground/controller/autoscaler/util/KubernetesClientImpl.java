package org.ballerinalang.platform.playground.controller.autoscaler.util;

import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.api.model.ServiceList;
import io.fabric8.kubernetes.api.model.extensions.Deployment;
import io.fabric8.kubernetes.api.model.extensions.DeploymentList;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;

import java.util.ArrayList;
import java.util.List;

public class KubernetesClientImpl implements ContainerRuntimeClient {

    private KubernetesClient k8sClient;

    public KubernetesClientImpl() {
        this.k8sClient = new DefaultKubernetesClient();
    }

    @Override
    public void createDeployment(String namespace) {

    }

    @Override
    public void createService(String namespace) {

    }

    @Override
    public void deleteDeployment(String namespace, String deploymentName) {

    }

    @Override
    public void deleteService(String namespace, String serviceName) {

    }

    @Override
    public List<String> getDeployments(String namespace) {
        DeploymentList depList = k8sClient.extensions().deployments().inNamespace(namespace).list();
        List<String> depNameList = new ArrayList<>();
        for (Deployment deployment : depList.getItems()) {
            depNameList.add(deployment.getMetadata().getName());
        }

        return depNameList;
    }

    @Override
    public List<String> getServices(String namespace) {
        ServiceList serviceList = k8sClient.services().inNamespace(namespace).list();
        List<String> serviceNameList = new ArrayList<>();
        for (Service service : serviceList.getItems()) {
            serviceNameList.add(service.getMetadata().getName());
        }

        return serviceNameList;
    }
}
