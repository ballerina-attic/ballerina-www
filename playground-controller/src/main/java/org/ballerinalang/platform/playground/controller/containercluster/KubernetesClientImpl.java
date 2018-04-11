package org.ballerinalang.platform.playground.controller.containercluster;

import io.fabric8.kubernetes.api.model.Container;
import io.fabric8.kubernetes.api.model.ContainerPort;
import io.fabric8.kubernetes.api.model.ContainerPortBuilder;
import io.fabric8.kubernetes.api.model.EnvVar;
import io.fabric8.kubernetes.api.model.EnvVarBuilder;
import io.fabric8.kubernetes.api.model.IntOrString;
import io.fabric8.kubernetes.api.model.ObjectMeta;
import io.fabric8.kubernetes.api.model.ObjectMetaBuilder;
import io.fabric8.kubernetes.api.model.PodSpec;
import io.fabric8.kubernetes.api.model.PodSpecBuilder;
import io.fabric8.kubernetes.api.model.PodTemplateSpec;
import io.fabric8.kubernetes.api.model.PodTemplateSpecBuilder;
import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.api.model.ServiceBuilder;
import io.fabric8.kubernetes.api.model.ServiceList;
import io.fabric8.kubernetes.api.model.ServicePort;
import io.fabric8.kubernetes.api.model.ServiceSpec;
import io.fabric8.kubernetes.api.model.ServiceSpecBuilder;
import io.fabric8.kubernetes.api.model.extensions.Deployment;
import io.fabric8.kubernetes.api.model.extensions.DeploymentBuilder;
import io.fabric8.kubernetes.api.model.extensions.DeploymentList;
import io.fabric8.kubernetes.api.model.extensions.DeploymentSpec;
import io.fabric8.kubernetes.api.model.extensions.DeploymentSpecBuilder;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;
import org.ballerinalang.platform.playground.controller.util.Constants;
import org.ballerinalang.platform.playground.controller.util.ControllerUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.time.temporal.ChronoUnit.MINUTES;

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
    public boolean createDeployment(int deploymentNameSuffix) {
        String deploymentName = Constants.BPG_APP_TYPE_LAUNCHER + "-" + deploymentNameSuffix;

        String serviceSubDomain = Constants.LAUNCHER_URL_PREFIX + "-" + deploymentNameSuffix;
        String launcherSelfUrl = serviceSubDomain + "." + Constants.DOMAIN_PLAYGROUND_BALLERINA_IO;

        log.info("Creating Deployment [Name] " + deploymentName + "...");

        // Labels for the to be created deployment
        Map<String, String> labels = new HashMap<>();
        labels.put("app", deploymentName);
        labels.put("appType", Constants.BPG_APP_TYPE_LAUNCHER);

        // Container spec
        Container launcherContainer = new Container();

        // Add container info
        launcherContainer.setName(Constants.BPG_APP_TYPE_LAUNCHER + "-container");
        launcherContainer.setImage(launcherImageName);
        launcherContainer.setImagePullPolicy("Always");

        // MSF4J port
        List<ContainerPort> containerPorts = new ArrayList<>();
        containerPorts.add(new ContainerPortBuilder()
                .withContainerPort(8080)
                .build());

        launcherContainer.setPorts(containerPorts);

        List<Container> containers = new ArrayList<>();
        containers.add(launcherContainer);

        // Env vars should be set so that the launcher is able to
        // 1. Communicate with the persistence
        // 2. Register itself as free when a job is done
        // 3. Perform proper role (cache node vs build node)
        List<EnvVar> envVarList = new ArrayList<>();

        envVarList.add(buildEnvVar(Constants.ENV_BPG_REDIS_WRITE_HOST,
                ControllerUtils.getEnvStringValue(Constants.ENV_BPG_REDIS_WRITE_HOST)));
        envVarList.add(buildEnvVar(Constants.ENV_BPG_REDIS_WRITE_PORT,
                ControllerUtils.getEnvStringValue(Constants.ENV_BPG_REDIS_WRITE_PORT)));
        envVarList.add(buildEnvVar(Constants.ENV_BPG_REDIS_READ_HOST,
                ControllerUtils.getEnvStringValue(Constants.ENV_BPG_REDIS_READ_HOST)));
        envVarList.add(buildEnvVar(Constants.ENV_BPG_REDIS_READ_PORT,
                ControllerUtils.getEnvStringValue(Constants.ENV_BPG_REDIS_READ_PORT)));
        envVarList.add(buildEnvVar(Constants.ENV_DB_HOST,
                ControllerUtils.getEnvStringValue(Constants.ENV_DB_HOST)));
        envVarList.add(buildEnvVar(Constants.ENV_DB_PORT,
                ControllerUtils.getEnvStringValue(Constants.ENV_DB_PORT)));
        envVarList.add(buildEnvVar(Constants.ENV_BPG_NAMESPACE, namespace));
        envVarList.add(buildEnvVar(Constants.ENV_BPG_LAUNCHER_SELF_URL, launcherSelfUrl));
        envVarList.add(buildEnvVar(Constants.ENV_IS_LAUNCHER_CACHE, "false"));

//        envVarList.add(buildEnvVar(Constants.ENV_LAUNCHER_IMAGE_NAME, launcherImageName));
//        envVarList.add(buildEnvVar(Constants.ENV_DESIRED_COUNT, ControllerUtils.getEnvStringValue(Constants.ENV_DESIRED_COUNT)));
//        envVarList.add(buildEnvVar(Constants.ENV_MAX_COUNT, ControllerUtils.getEnvStringValue(Constants.ENV_MAX_COUNT)));
//        envVarList.add(buildEnvVar(Constants.ENV_STEP_UP, ControllerUtils.getEnvStringValue(Constants.ENV_STEP_UP)));
//        envVarList.add(buildEnvVar(Constants.ENV_STEP_DOWN, ControllerUtils.getEnvStringValue(Constants.ENV_STEP_DOWN)));
//        envVarList.add(buildEnvVar(Constants.ENV_FREE_BUFFER, "6397"));
//        envVarList.add(buildEnvVar("BPG_SCALING_IDLE_TIMEOUT_MIN", "6397"));
//        envVarList.add(buildEnvVar("BPG_CONTROLLER_ROLE", "6397"));

        launcherContainer.setEnv(envVarList);

        // TODO: NFS volume
//        List<Volume> volumes = new ArrayList<>();

        PodSpec podSpec = new PodSpecBuilder()
                .withContainers(containers)
//                .withVolumes(volumes)
                .build();

        PodTemplateSpec podTemplateSpec = new PodTemplateSpecBuilder()
                .withMetadata(new ObjectMetaBuilder()
                        .withLabels(labels)
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
        Deployment createdDeployment = k8sClient.extensions().deployments().inNamespace(namespace).create(deployment);
        return createdDeployment == null;
    }

    @Override
    public boolean createService(int serviceNameSuffix) {
        String serviceSubDomain = Constants.LAUNCHER_URL_PREFIX + "-" + serviceNameSuffix;
        String serviceName = Constants.BPG_APP_TYPE_LAUNCHER + "-" + serviceNameSuffix;

        log.info("Creating Service with [Name] " + serviceName + " for [Sub Domain]" + serviceSubDomain + "...");

        // Service load balancer annotations
        Map<String, String> annotations = new HashMap<>();
        annotations.put("serviceloadbalancer/lb.cookie-sticky-session", "true");
        annotations.put("serviceloadbalancer/lb.host", serviceSubDomain + "." + Constants.DOMAIN_PLAYGROUND_BALLERINA_IO);
        annotations.put("serviceloadbalancer/lb.sslTerm", "true");

        // Labels
        Map<String, String> labels = new HashMap<>();
        labels.put("app", serviceName);
        labels.put("appType", Constants.BPG_APP_TYPE_LAUNCHER);

        // Port to be exposed
        List<ServicePort> ports = new ArrayList<>();
        ServicePort servicePort = new ServicePort();
        servicePort.setName("https-port");
        servicePort.setPort(443);
        servicePort.setTargetPort(new IntOrString(443));
        ports.add(servicePort);

        // Pod selector
        Map<String, String> selector = new HashMap<>();
        selector.put("app", serviceName);

        ObjectMeta serviceMetadata = new ObjectMetaBuilder()
                .withName(serviceName)
                .withAnnotations(annotations)
                .withLabels(labels)
                .build();

        ServiceSpec serviceSpec = new ServiceSpecBuilder()
                .withPorts(ports)
                .withSelector(selector)
                .build();

        Service service = new ServiceBuilder()
                .withKind("Service")
                .withMetadata(serviceMetadata)
                .withSpec(serviceSpec)
                .build();

        Service createdService = k8sClient.services().inNamespace(namespace).create(service);

        return createdService == null;
    }

    @Override
    public boolean deleteDeployment(String deploymentName) {
        return k8sClient.extensions().deployments().inNamespace(namespace).withName(deploymentName).delete();
    }

    @Override
    public boolean deleteService(String serviceName) {
        return k8sClient.services().inNamespace(namespace).withName(serviceName).delete();
    }

    @Override
    public List<String> getDeployments() {
        DeploymentList depList = k8sClient.extensions().deployments()
                .inNamespace(namespace)
                .withLabel("appType", Constants.BPG_APP_TYPE_LAUNCHER)
                .list();

        List<String> depNameList = new ArrayList<>();
        for (Deployment deployment : depList.getItems()) {
            depNameList.add(deployment.getMetadata().getName());
        }

        return depNameList;
    }

    @Override
    public List<String> getServices() {
        ServiceList serviceList = k8sClient.services().inNamespace(namespace).withLabel("appType", Constants.BPG_APP_TYPE_LAUNCHER).list();
        List<String> serviceNameList = new ArrayList<>();
        for (Service service : serviceList.getItems()) {
            serviceNameList.add(service.getMetadata().getName());
        }

        return serviceNameList;
    }

    @Override
    public boolean deploymentExists(String deploymentName) {
        return k8sClient.extensions().deployments().inNamespace(namespace).withName(deploymentName).get() != null;
    }

    @Override
    public boolean serviceExists(String serviceName) {
        return k8sClient.services().inNamespace(namespace).withName(serviceName).get() != null;
    }

    private EnvVar buildEnvVar(String key, String value) {
        return new EnvVarBuilder()
                .withName(key)
                .withValue(value)
                .build();
    }

    private long calculateObjectAgeByMinutes(String creationTimestamp) {
        LocalDate creationDate = LocalDate.parse(creationTimestamp);
        LocalDate now = LocalDate.now();

        return MINUTES.between(creationDate, now);
    }

//    @Override
//    public org.ballerinalang.platform.playground.controller.containercluster.model.Deployment getDeploymentByName(String deploymentName) {
//        Deployment deployment = k8sClient.extensions().deployments().inNamespace(namespace).withName(deploymentName).get();
//
//        if (deployment == null) {
//            return null;
//        }
//
//        org.ballerinalang.platform.playground.controller.containercluster.model.Deployment dep = new org.ballerinalang.platform.playground.controller.containercluster.model.Deployment();
//
//        dep.setName(deployment.getMetadata().getName());
//        dep.setNamespace(namespace);
//        dep.setAge(calculateObjectAge(deployment.getMetadata().getCreationTimestamp()));
//
//        return dep;
//    }
}
