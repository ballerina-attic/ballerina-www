# How to Run and Deploy Ballerina Programs

## Running Ballerina Programs and Services
A Ballerina application can either be:
1. A `main()` function that runs as a terminating process.
2. A `service<>` which is a hosted non-terminating process.

Both of these are considered "entrypoints" for program execution. 

These applications can be structured into a single program file or a Ballerina package. A collection of packages or source files can be managed together with versioning and dependency management as part of a Ballerina project. 

Source files and packages can contain zero or more entrypoints, and the runtime engine has precedence and sequence rules for choosing which entrypoint to execute.

### Running Standalone Source Code
A single Ballerina source code file can be placed into any folder. 

If source file contains at least one entrypoint then it can be executed using run command.
    
```bash
ballerina run foo.bal  
```

You can compile a source file with an entrypoint into a linked binary that has a .balx extension.
    
```bash
ballerina build a/b/c/foo.bal [-o outputfilename.balx]
```  

And you can run .balx files directly:
```bash
ballerina run filename.balx
```

### Running a Project
A project is a folder that manages source files and packages as part of a common versioning, dependency management, build, and execution. You can build and run items collectively or individually as packages. See How To Structure Ballerina Programs for in-depth structuring of projects.

Build all source files and packages of a project:
```bash    
ballerina build
```

Build a single package in a project:
```bash
ballerina build <package-name>
```

Options for running programs with entrypoints in a project:  
```bash
ballerina run main.balx  
ballerina run target/main.balx
ballerina [-projectroot <path>] run <package>
```

The `<package>` is the name of the package which is the same as the directory name that holds source files. 

## Configuring Your Ballerina Runtimes

### Ballerina Runtime Configuration Files
TODO: SECTION ON ballerina.conf, how it is found, how it is loaded, and how to find out what params you can configure
zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz

TODO THIS IS SOME STUFF THAT I FOUND BELOW THAT PROBABLY BELONGS HERE
To explicitly specify a configuration file, use either the `--config` or the `-c` flag. The path to the configuration file can be either an absolute or a relative path. If this flag is not set, Ballerina looks for a `ballerina.conf` file in the directory in which the source files are located.

### Sourcing Parameters Into Ballerina Programs
Configuration parameters for your programs and apps cna be defined on the CLI, as an environment variable, or from a configuration file, with loading and override precedence in the same order.

Configuration parameters are arbitrary key/value pairs with structure. The `ballerina/config` package provides an API for sourcing configuration parameters and using them within source code. [Config API Documentation]([https://stage.ballerina.io/learn/api-docs/ballerina/config.html](https://stage.ballerina.io/learn/api-docs/ballerina/config.html)).

The configuration APIs accept a key and an optional default value. If a mapping does not exist for the specified key, the default value is returned as the configuration value. The default values of these optional configurations are the default values of the return types of the functions.

#### Sourcing CLI Parameters
TODO: Need an example of setting CLI and reading it in app
#### Sourcing Environment Parameters
TODO: Need an example of setting an environment variable on CLI and reading it in app
#### Sourcing Configuration Values
TODO: Need an example of getting a configuration value from a file and reading it in app

#### Configure Secrets as Configuration Items
Ballerina provides support for encrypting sensitive data such as passwords and allows access to them securely through the configuraiton API in the code.

##### Creating a Secured Value
The `ballerina encrypt` command will encrypt parameters that can be securely sourced from your code files. For example, let's create a secure parameter named `ballerina` with the value `12345` as the secret.

```ballerina
ballerina encrypt
Enter value:
Enter secret:
Re-enter secret to verify:
Add the following to the runtime config:

@encrypted:{jFMAXsuMSiOCaxuDLuQjVXzMzZxQrten0652/j93Amw=}

Or add to the runtime command line:
-e<param>=@encrypted:{jFMAXsuMSiOCaxuDLuQjVXzMzZxQrten0652/j93Amw=}
```

##### Using the Secured Value at Runtime
The secured value can be placed in a config file as a value or passed on the command line. 

```
[hello]
http.port=8085
keystore.password="@encrypted{jFMAXsuMSiOCaxuDLuQjVXzMzZxQrten0652/j93Amw=}"
```

or:

```bash
ballerina run config_api.bal -e hello.http.port=8085 -e hello.keystore.password=@encrypted:{jFMAXsuMSiOCaxuDLuQjVXzMzZxQrten0652/j93Amw=}
```

##### Decrypting the Value
If a configuration contains an encrypted value, Ballerina looks for a `secret.txt` file in the directory in which the source files are located. The `secret.txt` should contain the secret used to encrypt the value. The `secret.txt` file will be deleted after it is read. If `secret.txt` file is not present, the CLI prompts the user for the secret.

```bash
ballerina run --config path/to/conf/file/custom-config-file-name.conf config_api.bal
ballerina: enter secret for config value decryption:

ballerina: initiating service(s) in 'config_api.bal'
ballerina: started HTTPS/WSS endpoint 0.0.0.0:8085
```

## Deploying Ballerina Programs and Services
Deploying a Ballerina program or service is the process of creating assets that ready the program and services(s) for activation in another runtime, such as Docker Engine, Moby, Kubernetes, or Cloud Foundry. The Ballerina compiler is able to generate the necessary artifacts for different deployment annotations based upon annotations that decorate the source code, which provide compiler instructions for artifact generation.

### How Deployment Works
Ballerina has builder extensions that run after the compilation phase. These extensions analyze code to generate deployment artifacts and utilities to make deployment of your apps and services easier.

When you start building a project, the system starts parsing. This is followed by dependency analysis, compilation, and a phase at which deployment artifact generation can take place.

These deployment artifacts can be a form of simple files or complex types, like container images, virtual images, etc. The Ballerina builder extension supports the following list of deployment artifacts.

-   [Dockerfiles](https://docs.docker.com/engine/reference/builder/)
-   [Docker images](https://docs.docker.com/engine/reference/commandline/images/)
-   [Kubernetes](http://kubernetes.io) artifacts

It is possible for third parties and the ecosystem to create their own annotations and builder extensions that generate different kinds of deployment artifacts. You can publish these extensions within Ballerina Central for others to use. For more information, see How To Extend Ballerina.

### How to Enable Deployment
A developer enables deployment artifact generation by adding annotations to their Ballerina code: 

1.  Import the relevant extension package in the code.
2.  Add relevant annotation within the code. 
3.  Build the Ballerina project.

#### Docker-Based Deployment

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

Now your code is ready to generate deployment artifacts. In this case it is a Docker image.
  
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

The following features are supported by the Docker builder extension.

-   Dockerfile generation.
-   Docker image generation.
-   Docker push support with docker registry.
-   Docker based Ballerina debug support.
-   Copy file support.
    
##### Supported Docker Annotations

**@docker:Config{}**
- Supported with Ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the docker image|output .balx file name|
|registry|Docker registry|None|
|tag|Docker image tag|latest|
|buildImage|Whether to build docker image|true|
|dockerHost|Docker host IP and docker PORT (e.g., minikube IP and docker PORT)|unix:///var/run/docker.sock|
|dockerCertPath|Docker cert path|null|
|baseImage|Base image to create the docker image|ballerina/ballerina:latest|
|enableDebug|Enable debug for ballerina|false|
|debugPort|Remote debug port|5005|
|push|Push to remote registry|false|
|username|Username for docker registry|None|
|password|Password for docker registry|None|

**@docker:CopyFiles{}**
- Supported with Ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|source|Source path of the file (in your machine)|None|
|target|Target path (inside container)|None|
|isBallerinaConf|Flag whether the file is a Ballerina config file|false|

**@docker:Expose{}**
- Supported with Ballerina endpoints.

For more information, see the [Docker build extension github repo](https://github.com/ballerinax/docker).

#### Kubernetes-Based Deployment

Kubernetes builder extension offers native support for running a ballerina programs on Kubernetes with the use of annotations that you can include as part of your service code. Also, it will take care of the creation of the docker images. So you don't need to explicitly create docker images prior to deploying it on Kubernetes.

The following Kubernetes configuration are supported:
-   Kubernetes deployment support
-   Kubernetes service support
-   Kubernetes liveness probe support
-   Kubernetes ingress support
-   Kubernetes horizontal pod autoscaler support
-   Docker image generation
-   Docker push support with remote docker registry
-   Kubernetes secret support
-   Kubernetes config map support
-   Kubernetes persistent volume claim support

Following ballerina code section explain how you can use some of these Kubernetes capabilities by using Kubernetes annotation support in Ballerina.

```ballerina
package data_backed_service;
import ballerinax/kubernetes;

// Create SQL endpoint to MySQL database
endpoint mysql:Client employeeDB {
    host:config:getAsString("db-host"),
    port:3306,
    name:config:getAsString("db"),
    username:config:getAsString("db-username"),
    password:config:getAsString("db-passowrd"),
};

@kubernetes:ConfigMap {
    ballerinaConf:"./database.toml",
}

@kubernetes:Ingress {
    hostname:"ballerina.guides.io",
    name:"ballerina-guides-employee-database-service",
    path:"/"
}

@kubernetes:Service {
    serviceType:"NodePort",
    name:"ballerina-guides-employee-database-service"
}

@kubernetes:Deployment {
    image:"ballerina.guides.io/employee_database_service:v1.0",
    name:"ballerina-guides-employee-database-service",
    copyFiles:[{target:"/ballerina/runtime/bre/lib",
                source:<path_to_JDBC_jar>}]
}

endpoint http:Listener listener {
    port:9090,
    secureSocket:{
        keyStore:{
            path:"${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password:getAsString("key-store-passowrd")
        },
        trustStore:{
            path:"${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password:getAsString("trust-store-passowrd")
        }
    }
};

@http:ServiceConfig {
    basePath:"/records"
}
service<http:Service> employee_data_service bind listener {
```

Sample content of the data-service.toml

```toml
# Ballerina database config file
db-host = ""
db = ""
db-username = "root"
db-passoword = ""
key-store-passoword = ""
trust-store-passoword = ""
```


Here we have used @kubernetes:Deployment to specify the docker image name which will be created as part of building this service. CopyFiles field is used to copy the MySQL jar file into the ballerina bre/lib folder. Make sure to replace the <path_to_JDBC_jar> with your JDBC jar's path.

We have also specified @kubernetes:Service {} so that it will create a Kubernetes service which will expose the Ballerina service that is running on a Pod.

In addition we have used @kubernetes:Ingress which is the external interface to access your service (with path / and host name ballerina.guides.io)

Now you can build a Ballerina executable archive (.balx) of the service that we developed above, using the following command. It points to the service file that we developed above and it will create an executable binary out of that. This will also create the corresponding docker image and the Kubernetes artifacts using the Kubernetes annotations that you have configured above.

```bash
$ballerina build data_backed_service

Run following command to deploy kubernetes artifacts:  
kubectl apply -f ./target/data_backed_service/kubernetes
```

You can verify that the docker image that we specified in @kubernetes:Deployment is created, by using docker images.
Also the Kubernetes artifacts related our service, will be generated in ./target/data_backed_service/kubernetes.
Now you can create the Kubernetes deployment using:

```bash
$kubectl apply -f ./target/data_backed_service/kubernetes 

deployment.extensions "ballerina-guides-employee-database-service" created
ingress.extensions "ballerina-guides-employee-database-service" created
service "ballerina-guides-employee-database-service" created
```
You can verify Kubernetes deployment, service and ingress are running properly, by using following Kubernetes commands.

```bash
$kubectl get service
$kubectl get deploy
$kubectl get pods
$kubectl get ingress
```
If everything is successfully deployed, you can invoke the service either via Node port or ingress.
Node Port:
```bash
curl -v -X POST -d '{"name":"Alice", "age":20,"ssn":123456789,"employeeId":1}' \
"http://localhost:<Node_Port>/records/employee" -H "Content-Type:application/json" 
```
Ingress:

Add /etc/hosts entry to match hostname.

```bash
127.0.0.1 ballerina.guides.io
```
Access the service

```bash
curl -v -X POST -d '{"name":"Alice", "age":20,"ssn":123456789,"employeeId":1}' \
"http://ballerina.guides.io/records/employee" -H "Content-Type:application/json"
```   

    
##### Supported Kubernetes Annotations

**@kubernetes:Deployment{}**
- Supported with Ballerina services or endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the deployment|\<outputfilename\>-deployment|
|labels|Labels for deployment|"app: \<outputfilename\>"|
|replicas|Number of replicas|1|
|enableLiveness|Enable or disable liveness probe|disable|
|initialDelaySeconds|Initial delay in seconds before performing the first probe|10s|
|periodSeconds|Liveness probe interval|5s|
|livenessPort|Port that the liveness probe checks|\<ServicePort\>|
|imagePullPolicy|Docker image pull policy|IfNotPresent|
|image|Docker image with tag|<output file name>:latest|
|env|List of environment variables|null|
|buildImage|Building docker image|true|
|copyFiles|Copy external files for Docker image|null|
|dockerHost|Docker host IP and docker PORT (e.g., "tcp://192.168.99.100:2376")|null|
|dockerCertPath|Docker cert path|null|
|push|Push docker image to registry. This can only be true if image build is true.|false|
|username|Username for the docker registry|null|
|password|Password for the docker registry|null|
|baseImage|Base image to create the docker image|ballerina/ballerina:latest|

**@kubernetes:Service{}**
- Supported with Ballerina endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the service|\<ballerina service name\>-service|
|labels|Labels for the service|"app: \<outputfilename\>"|
|serviceType|Service type of the service|ClusterIP|
|port|Service port|Port of the Ballerina service|

**@kubernetes:Ingress{}**
- Supported with Ballerina endpoints.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of Ingress|\<ballerina service name\>-ingress
|labels|Labels for service|"app: \<outputfilename\>"
|hostname|Host name of Ingress|\<ballerina service name\>.com
|path|Resource path.|/
|targetPath|This is used for URL rewrite.|null
|ingressClass|Ingress class|nginx
|enableTLS|Enable ingress TLS|false

**@kubernetes:HPA{}**
- Supported with Ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the Horizontal Pod Autoscaler|\<ballerina service name\>-hpa|
|labels|Labels for service|"app: \<outputfilename\>"|
|minReplicas|Minimum number of replicas|No of replicas in deployment|
|maxReplicas|Maximum number of replicas|minReplicas+1|
|cpuPrecentage|CPU percentage to start scaling|50|

**@kubernetes:Secret{}**
- Supported with Ballerina service.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the secret volume mount|\<service_name\>-secret|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|data|Paths to data files|null|

**@kubernetes:ConfigMap{}**
- Supported with Ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the configmap volume mount|\<service_name\>-config-map|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|true|
|ballerinaConf|Ballerina conf file location|null|
|data|Paths to data files|null|

**@kubernetes:PersistentVolumeClaim{}**
- Supported with Ballerina services.

|**Annotation Name**|**Description**|**Default value**|
|--|--|--|
|name|Name of the volume mount|null|
|mountPath|Path to mount on container|null|
|readOnly|Is mount read only|false|
|accessMode|Access mode|ReadWriteOnce|
|volumeClaimSize|Size of the volume claim|null|

**@kubernetes:Job{}**
- Supported with Ballerina main function.

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
  
### Extend Ballerina Deployment and Annotations
Ballerina can be augmented with your own annotations that represent your own unique deployment artifacts. You can also write builder extensions that generate these files during compilation. For more information on how to extend Ballerina, see [How to Extend Ballerina](/learn/how-to-extend-ballerina/).
