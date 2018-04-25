# Quick Tour

Now that you know a little bit [about Ballerina](/philosophy), let's take it for a spin! 

## Install Ballerina

1. Go to [https://ballerina.io/](/) and click **Download Ballerina**. 
1. Download Ballerina for your OS and follow the instructions given to set it up. 

> NOTE: Throughout this documentation, `<ballerina_home>` refers to the Ballerina directory you just installed. 

## Start a project and run a service

Start your project by navigating to a directory of your choice and running the following command.

```bash
ballerina init
```

You see a response confirming that your project is initialized. This automatically creates a typical Hello World service for you. You can run the service by using a run command.

```bash
$ ballerina run hello_service.bal
```

You will see the following response.

```bash
ballerina: initiating service(s) in 'hello_service.bal'
ballerina: started HTTP/WS endpoint 0.0.0.0:9090
```

This means your service is up and running. You can call the service by opening a new command line window and using the following cURL command.

```bash
curl http://localhost:9090/hello/sayHello
```

You get the following response.

```
Hello Ballerina!
```

You just started Ballerina, created a project, started a service, and received a response within minutes.

## Set up the Editor

Let's try this on VS Code.

```bash
code /<folder path>/hello_service.bal
```

You can view your service in VS Code.

```ballerina
// A system package containing protocol access constructs
// Package objects referenced with 'http:' in code
import ballerina/http;
import ballerina/io;

// A service endpoint represents a listener
endpoint http:Listener listener {
    port:9090
};

// A service is a network-accessible API
// Advertised on '/hello', port comes from listener endpoint
service<http:Service> hello bind listener {

    // A resource is an invokable API method
    // Accessible at '/hello/sayHello
    // 'caller' is the client invoking this resource 
    sayHello (endpoint caller, http:Request request) {

        // Create object to carry data back to caller
        http:Response response = new;

        // Objects and structs can have function calls
        response.setStringPayload("Hello Ballerina!\n");

        // Send a response back to caller
        // Errors are ignored with '_'
        // -> indicates a synchronous network-bound call
        _ = caller -> respond(response);
    }
}
```

You can find a plugin for Ballerina in the VS Code marketplace. This helps read the `.bal` file using an ideal theme. Check if annotations work by entering some text and seeing proposed suggestions.

![VS Code Annotations](/img/docs-images/vscode_annotations.png)

You can use your [favourite editor to work on Ballerina code](https://github.com/ballerina-platform/ballerina-lang/blob/master/docs/tools-ides-ballerina-composer.md).

## Deploying on Kubernetes

Now that your service is created, you can deploy this on Kubernetes. 

> TIP: This was tested on the community edition version of Docker Edge with Kubernetes enabled and running in the background. Docker Edge comes with the option of enabling Kubernetes under Docker preferences.

First, as usual add the corresponding package:

```
import ballerinax/kubernetes;
```

Now, let’s add the code you need to run the service in Kubernetes.

```ballerina
// Kubernetes configurations
// This is the Kubernetes service annotation added to our listener 
// This tells us that we want to expose it from Kubernetes 
// The type is NodePort under the name of hello-world:

@kubernetes:SVC{
   serviceType:"NodePort",
   name:"hello-world"
}
endpoint http:ServiceEndpoint listener {
  port:9090
};


// This creates a docker image and a deployment into which it puts it.

@kubernetes:Deployment {
   image: "hello/hello-world",
   name: "hello-world"
} 
```

That's it - let’s go ahead and build it.

```
$ ballerina build hello-world.bal
```

Once you build it, you get the following response. This means the service is successfully deployed in Kubernetes.

```
@docker                          - complete 3/3
@kubernetes:Deployment           - complete 1/1
@kubernetes:Service              - complete 1/1
```

Run the following command to deploy Kubernetes artifacts. Specify the folder path where your program is located.

```
kubectl apply -f /<folder path>/KubTest/kubernetes/
```

This creates a folder called kubernetes and puts the deployment artifacts and the docker image inside it.

```
$ docker images |grep demo
```

```
demo/ballerina-demo    latest     7bb8a49ef708     38 seconds ago      120MB
```

You can now deploy it to Kubernetes using the following command.

```
$ kubectl apply -f kubernetes
```

You see the following on your console.

```
deployment "ballerina-demo" created
service "ballerina-demo" created
```

Let’s see if it is running:

```
$ kubectl get svc
```
This results in output similar to the following. Make note of the port number that Kubernetes provides (31977 in this case).

```
NAME             TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)  AGE
ballerina-demo   NodePort    10.98.238.0   <none>        9090:31977/TCP  24s
kubernetes       ClusterIP   10.96.0.1     <none>        443/TCP  2d
```

We can now invoke the service. This example is done using local Kubernetes but the same behavior would happen in the cloud. Using the port number that Kubernetes gave us, run the following cURL command.

```
$ curl -X POST  http://localhost:31977/demo
```

You get the output from Kubernetes itself.

```
Hello World!
```

## Run the Composer

1. In the command line, type `composer`.

1. Access the Composer from the following URL in your browser: `http://localhost:9091`
