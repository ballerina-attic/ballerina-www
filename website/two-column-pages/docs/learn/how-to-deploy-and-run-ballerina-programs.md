# How to Deploy and Run Ballerina Programs


## Running Ballerina Programs & Services


## Deploying Ballerina Programs & Services

Ballerina has builder extensions that run after the compilation phase. These extensions analyze code to generate deployment artifacts and utilities to make deployment of your apps and services easier.

When you start building a project, the system starts parsing. This is followed by dependency analysis, compilation, and a phase at which deployment artifact generation can take place.

These deployment artifacts can be a form of simple files or complex types, like container images, virtual images, etc. The Ballerina builder extension supports the following list of deployment artifacts.

-   [Dockerfiles](https://docs.docker.com/engine/reference/builder/)
-   [Docker images](https://docs.docker.com/engine/reference/commandline/images/)
-   [Kubernetes](http://kubernetes.io) artifacts

### How to Enable Deployment Options

A developer can enable deployment artifact generation by adding simple annotations to the code. The developer can choose one or more builder extensions within the code to generate these deployment artifacts by following three simple steps.

1.  Import the relevant extension package in the code.
2.  Add relevant annotation within the code. 
3.  Build the Ballerina project

#### Docker-based Deployment

See the following example on how a developer can add Docker support in the code.

```ballerina
import ballerina/http;  
import ballerinax/docker;  
  
@http:ServiceConfig {  
    basePath:"/helloWorld"  
}  
@docker:Config {
    registry:"docker.abc.com",  
    name:"helloworld",  
    tag:"v1.0"
}  
service<http:Service> helloWorld bind {9090} {  
    sayHello(endpoint outboundEP, http:Request request) {  
	http:Response response = new;  
	response.setStringPayload("Hello, World from service helloWorld ! \n");  
	_ = outboundEP->respond(response);  
    }  
}
```

Now your code is ready to generate deployment artifacts. In this case it is a docker image.

  
```bash
$> ballerina build hello_world_docker.bal  
@docker - complete 3/3  
Run following command to start docker container:  
docker run -d -p 9090:9090 docker.abc.com/helloworld:v1.0
```
  
```bash
$> tree  
.
├── README.md
├── hello_world_docker.bal
├── hello_world_docker.balx
└── docker
    └── Dockerfile
```
```bash
$> docker images  
REPOSITORY TAG IMAGE ID CREATED SIZE  
docker.abc.com/helloworld v1 df83ae43f69b 2 minutes ago 102MB
```
  
You can run a docker container and access it with your code by just copying and pasting the docker run command that displays as output of the Ballerina build command.
 ```bash 
$> docker run -d -p 9090:9090 docker.abc.com/helloworld:v1.0  
130ded2ae413d0c37021f2026f3a36ed92e993c39c260815e3aa5993d947dd00
```
```bash
$> docker ps  
CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES  
130ded2ae413 docker.abc.com/helloworld:v1.0 "/bin/sh -c 'balleri…" Less than a second ago Up 3 seconds 0.0.0.0:9090->9090/tcp thirsty_hopper
```
Access the hello world service with a cURL command:
```bash 
$> curl http://localhost:9090/helloWorld/sayHello  
Hello, World!
```
  

The following features are supported by current Docker builder extension.

-   Dockerfile generation.
-   Docker image generation.
-   Docker push support with docker registry.
-   Docker based ballerina debug support.
-   Copy file support.
    

#### Supported Annotations:

#### @docker:Config{}
- Supported with ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the docker image|output balx file name|
|registry|Docker registry|None|
|tag|Docker image tag|latest|
|buildImage|Whether to build docker image|true|
|dockerHost|Docker host IP and docker PORT. ( e.g minikube IP and docker PORT)|unix:///var/run/docker.sock|
|dockerCertPath|Docker cert path|null|
|baseImage|Base image to create the docker image|ballerina/ballerina:latest|
|enableDebug|Enable debug for ballerina|false|
|debugPort|Remote debug port|5005|
|push|Push to remote registry|false|
|username|Username for docker registry|None|
|password|Password for docker registry|None|

#### @docker:CopyFiles{}
- Supported with ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|source|source path of the file (in your machine)|None|
|target|target path (inside container)|None|
|isBallerinaConf|flag whether file is a ballerina config file|false|

#### @docker:Expose{}
- Supported with ballerina endpoints.

For more information, see the [Docker build extension github repo](https://github.com/ballerinax/docker).

### Kubernetes Based Deployment

If you wish to see how container orchestration systems are supported by the builder extension, see [Kubernetes builder extension github repo](https://github.com/ballerinax/kubernetes).
  
The following functionalities are supported by Kubernetes builder extension.

-   Kubernetes deployment support.
-   Kubernetes service support.   
-   Kubernetes liveness probe support.
-   Kubernetes ingress support.
-   Kubernetes horizontal pod autoscaler support.
-   Docker image generation.
-   Docker push support with remote docker registry.
-   Kubernetes secret support.
-   Kubernetes config map support.
-   Kubernetes persistent volume claim support.
    
### Supported Annotations:

#### @kubernetes:Deployment{}
- Supported with ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the deployment|\<outputfilename\>-deployment|
|labels|Labels for deployment|"app: \<outputfilename\>"|
|replicas|Number of replicas|1|
|enableLiveness|Enable or disable liveness probe|disable|
|initialDelaySeconds|Initial delay in seconds before performing the first probe|10s|
|periodSeconds|Liveness probe interval|5s|
|livenessPort|Port which the Liveness probe check|\<ServicePort\>|
|imagePullPolicy|Docker image pull policy|IfNotPresent|
|image|Docker image with tag|<output file name>:latest|
|env|List of environment variables|null|
|buildImage|Building docker image|true|
|copyFiles|Copy external files for Docker image|null|
|dockerHost|Docker host IP and docker PORT.(e.g "tcp://192.168.99.100:2376")|null|
|dockerCertPath|Docker cert path|null|
|push|Push docker image to registry. This can only be true if image build is true.|false|
|username|Username for the docker registry|null|
|password|Password for the docker registry|null|
|baseImage|Base image to create the docker image|ballerina/ballerina:latest|

#### @kubernetes:Service{}
- Supported with ballerina endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Service|\<ballerina service name\>-service|
|labels|Labels for service|"app: \<outputfilename\>"|
|serviceType|Service type of the service|ClusterIP|
|port|Service port|Port of the ballerina service|

#### @kubernetes:Ingress{}
- Supported with ballerina endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Ingress|\<ballerina service name\>-ingress
|labels|Labels for service|"app: \<outputfilename\>"
|hostname|Host name of the ingress|\<ballerina service name\>.com
|path|Resource path.|/
|targetPath|This will use for URL rewrite.|null
|ingressClass|Ingress class|nginx
|enableTLS|Enable ingress TLS|false

#### @kubernetes:HPA{}
- Supported with ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Horizontal Pod Autoscaler|\<ballerina service name\>-hpa|
|labels|Labels for service|"app: \<outputfilename\>"|
|minReplicas|Minimum number of replicas|No of replicas in deployment|
|maxReplicas|Maximum number of replicas|minReplicas+1|
|cpuPrecentage|CPU percentage to start scaling|50|

#### @kubernetes:Secret{}
- Supported with ballerina service.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the secret volume mount|\<service_name\>-secret|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|data|Paths to data files|null|

#### @kubernetes:ConfigMap{}
- Supported with ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the configmap volume mount|\<service_name\>-config-map|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|ballerinaConf|Ballerina conf file location|null|
|data|Paths to data files|null|

#### @kubernetes:PersistentVolumeClaim{}
- Supported with ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the volume mount|null|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|false|
|accessMode|Access mode|ReadWriteOnce|
|volumeClaimSize|Size of the volume claim|null|

#### @kubernetes:Job{}
- Supported with ballerina main function.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name| Name of the job|\<output file name\>-job|
|labels| Labels for job|"app: \<outputfilename\>"|
|restartPolicy| Restart policy|Never|
|backoffLimit| Restart tries before termination|3|
|activeDeadlineSeconds| Active deadline seconds|20|
|schedule| Schedule for cron jobs|none|
|imagePullPolicy|Docker image pull policy|IfNotPresent|
|image|Docker image with tag|\<output file name\>:latest|
|env|List of environment variables|null|
|buildImage|Building docker image|true|
|dockerHost|Docker host IP and docker PORT.(e.g "tcp://192.168.99.100:2376")|null|
|dockerCertPath|Docker cert path|null|
|push|Push docker image to registry. This can only be true if image build is true.|false|
|username|Username for the docker registry|null|
|password|Password for the docker registry|null|
|baseImage|Base image to create the docker image|ballerina/ballerina:latest|
  
To learn more on how these builder extension annotations are used in real world scenarios, see the deployment section in [Ballerina by Guide](https://ballerina.io/learn/guides/).

### Extend the Ballerina Build and Deployment

Ballerina builder extension can be extended to support any kind of deployment artifacts depending on your requirement. For more information on how to extend Ballerina, see [How to Extend Ballerina](https://ballerina.io/learn/how-to-extend-ballerina/).

