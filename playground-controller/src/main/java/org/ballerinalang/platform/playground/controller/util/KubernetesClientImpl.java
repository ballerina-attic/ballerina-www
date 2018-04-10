package org.ballerinalang.platform.playground.controller.util;

import io.fabric8.kubernetes.api.model.Container;
import io.fabric8.kubernetes.api.model.ContainerPort;
import io.fabric8.kubernetes.api.model.ContainerPortBuilder;
import io.fabric8.kubernetes.api.model.EnvVar;
import io.fabric8.kubernetes.api.model.EnvVarBuilder;
import io.fabric8.kubernetes.api.model.ObjectMetaBuilder;
import io.fabric8.kubernetes.api.model.PodSpec;
import io.fabric8.kubernetes.api.model.PodSpecBuilder;
import io.fabric8.kubernetes.api.model.PodTemplateSpec;
import io.fabric8.kubernetes.api.model.PodTemplateSpecBuilder;
import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.api.model.ServiceList;
import io.fabric8.kubernetes.api.model.extensions.Deployment;
import io.fabric8.kubernetes.api.model.extensions.DeploymentBuilder;
import io.fabric8.kubernetes.api.model.extensions.DeploymentList;
import io.fabric8.kubernetes.api.model.extensions.DeploymentSpec;
import io.fabric8.kubernetes.api.model.extensions.DeploymentSpecBuilder;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class KubernetesClientImpl implements ContainerRuntimeClient {

    private static final Logger log = LoggerFactory.getLogger(KubernetesClientImpl.class);

    private KubernetesClient k8sClient;
    private String namespace;
    private String launcherImageName;

    public KubernetesClientImpl(String namespace, String launcherImageName) {
        this.k8sClient = new DefaultKubernetesClient();
        this.namespace = namespace;
        this.launcherImageName = launcherImageName;
    }

    @Override
    public void createDeployment(String deploymentName) {
        log.info("Creating deployment " + deploymentName + "...");

        // Labels for the to be created deployment
        Map<String, String> labelMap = new HashMap<>();
        labelMap.put("app", deploymentName);
        labelMap.put("appType", Constants.BPG_APP_TYPE);

        // Container spec
        List<Container> containerList = new ArrayList<>();
        Container launcherContainer = new Container();
        containerList.add(launcherContainer);

        // Add container info
        launcherContainer.setName(Constants.BPG_APP_TYPE + "-container");
        launcherContainer.setImage(launcherImageName);
        launcherContainer.setImagePullPolicy("Always");

        // MSF4J port
        List<ContainerPort> containerPorts = new ArrayList<>();
        containerPorts.add(new ContainerPortBuilder()
                .withContainerPort(8080)
                .build());

        launcherContainer.setPorts(containerPorts);

        // Env vars should be set so that the launcher is able to Redis
        List<EnvVar> envVarList = new ArrayList<>();

        // TODO: add all the variables needed
        envVarList.add(new EnvVarBuilder()
                .withName("BPG_REDIS_WRITE_HOST")
                .withValue("redis-master")
                .build());

        launcherContainer.setEnv(envVarList);

        // TODO: NFS volume
//        List<Volume> volumes = new ArrayList<>();

        PodSpec podSpec = new PodSpecBuilder()
                .withContainers(containerList)
//                .withVolumes(volumes)
                .build();

        PodTemplateSpec podTemplateSpec = new PodTemplateSpecBuilder()
                .withMetadata(new ObjectMetaBuilder()
                        .withLabels(labelMap)
                        .build())
                .withSpec(podSpec)
                .build();

        DeploymentSpec deploymentSpec = new DeploymentSpecBuilder()
                .withReplicas(1)
                .withTemplate(podTemplateSpec)
                .build();

        Deployment deployment = new DeploymentBuilder()
                .withKind("Deployment")
                .withMetadata(new ObjectMetaBuilder()
                        .withName(deploymentName)
                        .build())
                .withSpec(deploymentSpec)
                .build();

        // Make API call to create deployment
        k8sClient.extensions().deployments().inNamespace(namespace).create(deployment);
    }

    @Override
    public void createService() {

    }

    @Override
    public void deleteDeployment(String deploymentName) {

    }

    @Override
    public void deleteService(String serviceName) {

    }

    @Override
    public List<String> getDeployments() {
        DeploymentList depList = k8sClient.extensions().deployments().inNamespace(namespace).withLabel("appType", Constants.BPG_APP_TYPE).list();
        List<String> depNameList = new ArrayList<>();
        for (Deployment deployment : depList.getItems()) {
            depNameList.add(deployment.getMetadata().getName());
        }

        return depNameList;
    }

    @Override
    public List<String> getServices() {
        ServiceList serviceList = k8sClient.services().inNamespace(namespace).list();
        List<String> serviceNameList = new ArrayList<>();
        for (Service service : serviceList.getItems()) {
            serviceNameList.add(service.getMetadata().getName());
        }

        return serviceNameList;
    }
}
