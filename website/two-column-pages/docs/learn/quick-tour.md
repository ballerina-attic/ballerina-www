# Quick Tour

Now that you know a little bit of `Ballerina`, let's take it for a spin! 

## Install Ballerina

1. [Download](https://ballerina.io/downloads) Ballerina based on the Operating System you are using. 
1. Follow the instructions given on the [Getting Started](/learn/getting-started) page to set it up. 

> **Note**: Throughout this documentation, `<ballerina_home>` refers to the directory in which you just installed Ballerina.

## Start a Project, Run a Service, and Invoke It

Start your project by navigating to a directory of your choice and running the following command with the project name 
`quick-start`.

```bash
$ ballerina new quick-start
```

You see a response confirming that your project is created and directing you to create a new module within the project. In order to create the new module, change the working directory to the newly created project folder. Afterwards, run the following command with the module name `sample_service` and the template name `service`

```bash
$ ballerina create sample_service -t service
```

This automatically creates a typical Hello World service for you in your directory. A Ballerina service represents a collection of network accessible entry points in Ballerina. A resource within a service represents one such entry point. The generated sample service exposes a network entry point on port 9090.

In order to run the service, you need to build the project using the following command.

```bash
$ ballerina build
```

Now, you can run the service by running the following command. 

```bash
$ ballerina run /<folder_path>/sample_service-executable.jar
```

You get the following output.

```bash
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
```

This means your service is up and running. You can invoke the service using an HTTP client. In this case, we use cURL.

```bash
$ curl -v http://localhost:9090/hello/sayHello
```

> **Tip**: If you do not have cURL installed, you can download it from [https://curl.haxx.se/download.html](https://curl.haxx.se/download.html).

You get the following response.

```
Hello Ballerina!
```

You just started Ballerina, created a project, started a service, invoked the service you created, and received a response. Now, let's see how we can make this hello service a bit more interesting. Before that let's setup the editor.

## Set up the Editor

Let's try this on VS Code.

> **Tip:** You can use your [favorite editor to work on Ballerina code](https://ballerina.io/learn/tools-ides/).

Open your service in VS Code. You can use the following command to do this on Linux or OSX. Replace '/<folder_path>/' with the actual folder path in which the Ballerina project was initialized.
=======
1. Download and install [VS Code][#https://code.visualstudio.com/Download](https://code.visualstudio.com/Download).

2. Execute the below commands based on your OS to open your service in VS Code. 

```bash
$ code /<folder_path>/hello_service.bal
```

On Windows, use the following.

```bash
$ code <folder_path>\hello_service.bal
```

> **Tip**: If you want to create new .bal files in addition to the Hello World service, you can open the initial project folder into editor using `code /<folder_path>` (on Windows it is `code <folder_path>`. You can also open VS Code and directly navigate to the directory or file.

You can view your service in VS Code.

```ballerina
// A system module containing protocol access constructs
// Module objects referenced with 'http:' in code
import ballerina/http;
import ballerina/io;

# A service is a network-accessible API
# Advertised on '/hello', port comes from listener endpoint
service hello on new http:Listener(9090) {

    # A resource is an invokable API method
    # Accessible at '/hello/sayHello
    # 'caller' is the client invoking this resource 

    # + caller - Server Connector
    # + request - Request
    resource function sayHello(http:Caller caller, http:Request request) {

        // Send a response back to caller
        // -> indicates a synchronous network-bound call
        error? result = caller->respond("Hello Ballerina!");
        if (result is error) {
            io:println("Error in responding", result);
        }
    }
}
```

You can find an extension for Ballerina in the VS Code marketplace. For instructions on installing and using it, see [The Visual Studio Code Extension](#https://ballerina.io/learn/tools-ides/vscode-plugin/).

## Use an Endpoint
Ballerina endpoint is a component that interacts with a network accessible service. It aggregates one or more actions that can be executed on the network accessible service. An endpoint can be used to configure parameters related to the network accessible service.

There are two kinds of endpoints in Ballerina, inbound (or ingress) and outbound (or egress) endpoints, a client object is an outbound endpoint, which we would use to send messages to a network service.

Having said that, let's see how you can make hello_service a bit more interesting by invoking an external endpoint. In this case, sunrise-sunset API is used as the backend service. First, you need to created the client with the relevant endpoint URL as follows.

```ballerina 
http:Client weatherApi = new("https://samples.openweathermap.org");
```

As the next step, let's tweak the service a bit to get sunrise/sunset time details for London. 

1. Change the service name to `sunriseSunset` and resource name to `london`.
2. Update the resource signature to have `error?` as the return value.

> **Note**: returning `error?` allows you to use `check` key word to avoid handling errors explicitly. This is only done to keep the code simple. But in real production code you may have to explicitly handle those errors. 

Following is the sample code with the aforementioned changes:

```ballerina
# A service is a network-accessible API
# Advertised on '/sunriseSunset', port comes from listener endpoint
service sunriseSunset on new http:Listener(9090) {

    # A resource is an invokable API method
    # Accessible at '/hello/sayHello
    # 'caller' is the client invoking this resource 

    # + caller - Server Connector
    # + request - Request
    # + return - error, if there is an issue
    resource function london(http:Caller caller, http:Request request) returns error? {
```

As the next step, add the below code line to do a Get request to the sunrise-sunset backend.

```ballerina
http:Response sunriseResp = check sunriseApi->get("/json?lat=51.5074&lng=0.1278");
```

As the next step, add the below code snippet to retrieve the payload and transform it to a simpler response payload.

```ballerina
json sunrisePayload = check sunriseResp.getJsonPayload();
// Creates the response payload
json resPayload = {
    city: "London",
    sunrise: check sunrisePayload.results.sunrise,
    suset: check sunrisePayload.results.sunset
};
```

As the last step you need to change the response payload that is being passed to `respond` action with the new json payload as shown below.

```ballerina
var result = check caller->respond(resPayload);
```
The complete source code should like similar to the following:

```ballerina
// A system module containing protocol access constructs
// Module objects referenced with 'http:' in code
import ballerina/http;
import ballerina/io;

http:Client sunriseApi = new("http://api.sunrise-sunset.org");

# A service is a network-accessible API
# Advertised on '/sunriseSunset', port comes from listener endpoint
service sunriseSunset on new http:Listener(9090) {

    # A resource is an invokable API method
    # Accessible at '/hello/sayHello
    # 'caller' is the client invoking this resource 

    # + caller - Server Connector
    # + request - Request
    # + return - error, if there is an issue
    resource function london(http:Caller caller, http:Request request) returns error? {
        http:Response sunriseResp = check sunriseApi->get("/json?lat=51.5074&lng=0.1278");

        json sunrisePayload = check sunriseResp.getJsonPayload();
        // Creates the response payload.
        json resPayload = {
            city: "London",
            sunrise: check sunrisePayload.results.sunrise,
            suset: check sunrisePayload.results.sunset
        };

        error? result = caller->respond(resPayload);
        if (result is error) {
            io:println("Error in responding", result);
        }
    }
}
```

Now, before we build the module, let's change the `sample_service.bal` to `sunrise_sunset_service.bal`.

All set. Once again, let's build the module by running the below command.

```bash
$ ballerina build
```

Now, you can run the service by running the following command. 

```bash
$ ballerina run /<folder_path>/sample_service-executable.jar
```

As before, you should get the following output.

```bash
[ballerina/http] started HTTP/WS listener 0.0.0.0:9090
```

This means your service is up and running. You can invoke the new service by running the below cURL command.

```bash
$ curl -v http://localhost:9090/sunriseSunset/london
```

## Follow the Repo

<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p> <p data-button="iGitWatchText">"Watch"</p></div>

Star [GitHub repo](https://github.com/ballerina-platform/ballerina-lang) and show appreciation to Ballerina maintainers for their work. Watch the repo to keep track of Ballerina issues.

## What's Next

Now, that you have taken Ballerina around for a quick tour, you can explore Ballerina more.

* Go through [Ballerina by Example](/learn/by-example/) to learn Ballerina incrementally with commented examples that cover every nuance of the syntax.
* See [Ballerina by Guide](/learn/by-guide/) for long form examples that showcase how to build different types of integrations using a complete development lifecycle including IDE configuration, modules, dependencies, coding, unit testing, deployment, and observability.
