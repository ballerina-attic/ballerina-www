# Quick Tour

Now that you know a little bit [about Ballerina](/philosophy), let's take it for a spin! 

## Install Ballerina

1. Go to the [Download page](https://ballerina.io/downloads) and click **Download Ballerina**.
1. Download Ballerina for your OS and follow the instructions given to set it up. For more information, see [Getting Started](/learn/getting-started).

> **Note**: Throughout this documentation, `<ballerina_home>` refers to the directory in which you just installed Ballerina.

## Start a Project, Run a Service, and Invoke It

Start your project by navigating to a directory of your choice and running the following command.

```bash
$ ballerina init
```

You see a response confirming that your project is initialized. This automatically creates a typical Hello World service for you in your directory. A Ballerina service represents a collection of network accessible entry points in Ballerina. A resource within a service represents one such entry point. The generated sample service exposes a network entry point on port 9090.

You can run the service using the `ballerina run` command.

```bash
$ ballerina run hello_service.bal
```

You get the following output.

```bash
ballerina: initiating service(s) in 'hello_service.bal'
ballerina: started HTTP/WS endpoint 0.0.0.0:9090
```

This means your service is up and running. You can invoke the service using an HTTP client. In this case, we use cURL.

```bash
$ curl http://localhost:9090/hello/sayHello
```

> **Tip**: If you do not have cURL installed, you can download it from [https://curl.haxx.se/download.html](https://curl.haxx.se/download.html).

You get the following response.

```
Hello Ballerina!
```

You just started Ballerina, created a project, started a service, invoked the service you created, and received a response.

## Set up the Editor

Let's try this on VS Code.

> **Note**: You need to have VS Code installed to try this. You can download it from [https://code.visualstudio.com/Download](https://code.visualstudio.com/Download).

Open your service in VS Code. You can use the following command to do this on Linux or OSX.

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
// A system package containing protocol access constructs
// Package objects referenced with 'http:' in code
import ballerina/http;
import ballerina/io;

// A service endpoint represents a listener
endpoint http:Listener listener {
    port: 9090
};

// A service is a network-accessible API
// Advertised on '/hello', port comes from listener endpoint
service<http:Service> hello bind listener {

    // A resource is an invokable API method
    // Accessible at '/hello/sayHello
    // 'caller' is the client invoking this resource 
    sayHello(endpoint caller, http:Request request) {

        // Create object to carry data back to caller
        http:Response response = new;

        // Objects and structs can have function calls
        response.setTextPayload("Hello Ballerina!\n");

        // Send a response back to caller
        // Errors are ignored with '_'
        // -> indicates a synchronous network-bound call
        _ = caller->respond(response);
    }
}
```

You can find a plugin for Ballerina in the VS Code marketplace. This helps read the `.bal` file using an ideal theme. 

> **Tip:** You can use your [favourite editor to work on Ballerina code](https://github.com/ballerina-platform/ballerina-lang/blob/master/docs/tools-ides-ballerina-composer.md).

### Annotations

Check if annotations work by entering some text and seeing proposed suggestions.

![VS Code Annotations](/img/docs-images/vscode_annotations.png)

Add the following annotation before the service to ensure that it is at the root path. This overwrites the default base path, which is the service name.

```ballerina
@http:ServiceConfig {
   basePath: "/"
}
```

Make the resource available at the root as well and change methods to POST. Add the following code snippet inside the service, before the `sayHello` resource. 

```ballerina
@http:ResourceConfig {
   methods: ["POST"],
   path: "/"
}
```

Now you can start the service again and call it by opening a new command line window and using the following cURL command.

```bash
$ curl http://localhost:9090 -X POST
```

> **Tip**: To ensure that you have root access, run the cURL command using `sudo`.

## Use an Endpoint

Ballerina client endpoint is a component that interacts with a network accessible service. It aggregates one or more actions that can be executed on the network accessible service. An endpoint can be used to configure parameters related to the network accessible service.

Ballerina Central stores numerous packages that that can be used with your service. You can search for them using the `ballerina search` command. Use the following command to search for packages where the package name, description, or org name contain the word "twitter".

```
$ ballerina search twitter
```

This results in a list of available packages. You can pull the one you want from Ballerina Central.

```
$ ballerina pull wso2/twitter
```

You can use the `wso2/twitter` package to integrate with a Twitter endpoint.

In your `hello_service.bal` file, import the Twitter package.

```ballerina
import wso2/twitter;
```

> **Note**: You can import the package and use it without using `ballerina pull`. `ballerina pull` ensures code completion.

You can now use Ballerina to integrate with Twitter.

## Send a Tweet

### Before you Begin

Prior to sending a Tweet, you need to create a Twitter app and get some information from Twitter.

> **Note**: You need to have a Twitter account set up with a valid mobile number to try this.

1. Go to [https://apps.twitter.com/](https://apps.twitter.com/) and click **Create New App**.

2. Fill the form that appears and click **Create your Twitter application**.

3. Once your app is created, navigate to the **Keys and Access Tokens** tab. Make note of the **Consumer Key (API Key)** and **Consumer Secret (API Secret)**. Generate an access token in the **Your Access Token** section by clicking **Create my access token**.

4. In the directory where you have your service, create a **twitter.toml** file and add the details you obtained above within the quotes.

```
    # Ballerina demo config file
    consumerKey = ""
    consumerSecret = ""
    accessToken = ""
    accessTokenSecret = ""
```

Now you can program Ballerina to send a tweet.

### Program Ballerina to Send a Tweet

In your `hello_service.bal` file, import the `ballerina/config` package.

```ballerina
import ballerina/config;
```

Add this code after the import statement.

```ballerina
endpoint twitter:Client twitter {
   clientId: config:getAsString("consumerKey"),
   clientSecret: config:getAsString("consumerSecret"),
   accessToken: config:getAsString("accessToken"),
   accessTokenSecret: config:getAsString("accessTokenSecret")
};
```

Here we are creating an endpoint to connect with the Twitter service. The above configuration is used to configure the connectivity to the Twitter service.

Now you have the Twitter endpoint.

In the `sayHello` resource, add the following to get the payload as a string.

```ballerina
string status = check request.getTextPayload();
```

> **Tip**: The check keyword means that this may return an error but I do not want to handle it here - pass it further away (to the caller function, or if this is a top-level function - generate a runtime failure).

Now, we can get our response from Twitter by just calling its tweet action. Add this into the `sayHello` resource as well.

```ballerina
twitter:Status st = check twitter->tweet(status);
response.setTextPayload("ID:" + <string>st.id + "\n");
```

The completed source code should look similar to the following:
```ballerina
import ballerina/config;
import ballerina/http;
import wso2/twitter;

endpoint twitter:Client twitterEP {
   clientId: config:getAsString("consumerKey"),
   clientSecret: config:getAsString("consumerSecret"),
   accessToken: config:getAsString("accessToken"),
   accessTokenSecret: config:getAsString("accessTokenSecret")
};

endpoint http:Listener listener {
    port: 9090
};

@http:ServiceConfig {
    basePath: "/"
}
service<http:Service> hello bind listener {

    @http:ResourceConfig {
        path: "/"
    }
    sayHello (endpoint caller, http:Request request) {
        string status = check request.getTextPayload();
        twitter:Status st = check twitterEP->tweet(status, "", "");

        http:Response response = new;
        response.setTextPayload("ID:" + <string>st.id + "\n");

        _ = caller->respond(response);
    }
}
```


Go ahead and run it and this time pass the config file:

```bash
$ ballerina run --config twitter.toml hello_service.bal
```

Now go to the terminal window and send a request containing the text for the tweet:

```bash
$ curl -d "Ballerina" -X POST localhost:9090
```

> **Tip**: To ensure that you have root access, run the cURL command using `sudo`.

You just tweeted using Ballerina!

## Deploying on Docker

Now that you have verified your service, let's go ahead and deploy this on Docker.

> **Tip**: This was tested on the community edition version of Docker Edge. You need to have Docker installed to use this. Also start/restart Docker prior to running your code. Windows users should enable **[Expose Daemon without TLS](https://github.com/ballerinax/docker/tree/master/samples#prerequisites)** option.

Import the Docker package.

```ballerina
import ballerinax/docker;
```

Now, let’s add the annotations you need to run the service in Docker. These annotations need to be added to the `listener` endpoint as shown below. The `@docker:CopyFiles` annotation copies the configuration file into the Docker image and the `@docker:Expose` annotation allows you to map an external port to the container port.

```ballerina
// Docker configurations
@docker:Config {
    registry:"registry.hub.docker.com",
    name:"helloworld",
    tag:"v1.0"
}
@docker:CopyFiles {
    files:[
        {source:"./twitter.toml", target:"/home/ballerina/conf/twitter.toml", isBallerinaConf:true}
    ]
}
@docker:Expose {}
endpoint http:Listener listener {
    port: 9090
};
```

> **Note**: On Windows, make sure Docker runs with Linux containers and in the general settings, enable `Expose daemon on tcp://localhost:2375 without TLS`. For more details, see the [Docker README](https://github.com/ballerinax/docker/blob/master/samples/README.md).

Now your code is ready to generate the deployment artifacts. In this case it is a Docker image.

```bash
 $ ballerina build hello_service.bal
```

You see something similar to the following output if this is successful.

```
Compiling source
    hello_service.bal

Generating executable
    hello_service.balx
        @docker                  - complete 3/3

        Run the following command to start a Docker container:
        docker run -d -p 9090:9090 registry.hub.docker.com/helloworld:v1.0

```

Run the following command to start the Docker container:

```bash
$ docker run -d -p 9090:9090 registry.hub.docker.com/helloworld:v1.0
```

> **Tip**: You can run a Docker container and access it with your code by just copying and pasting the `docker run` command that displays as output of the Ballerina build command.

Run the following command to check if Docker is running.

```bash
$ docker images
```

If Docker is running, you will see an output similar to the following.

```
REPOSITORY                                      TAG                 IMAGE ID            CREATED              SIZE
registry.hub.docker.com/helloworld              v1.0                eb4f9888f72f        About a minute ago   127MB
```

Run the following to get details of the Docker container.

```bash
$ docker ps
```

You will see an output similar to the following.

```
CONTAINER ID        IMAGE                                     COMMAND                  CREATED                  STATUS              PORTS                    NAMES
130ded2ae413        registry.hub.docker.com/helloworld:v1.0   "/bin/sh -c 'balleri…"   Less than a second ago   Up 3 seconds        0.0.0.0:9090->9090/tcp   thirsty_hopper
```

Use the following cURL command to invoke your Docker-hosted service.

```bash
$ curl -d "Hello Ballerina" -X POST localhost:9090
```

You have now posted a tweet using the Docker hosted service.

## Push your Package to Ballerina Central

For the `ballerina push` command to work, you need to copy and paste your Ballerina Central access token in `Settings.toml` in your home repository `<USER_HOME>/.ballerina/`.

Register on Ballerina Central and visit the user dashboard at [https://central.ballerina.io/dashboard](https://central.ballerina.io/dashboard) to gain access to your user token.  

When you push a package to Ballerina Central, the runtime validates organizations for the user against the `org-name` defined in your package’s `Ballerina.toml` file.

Therefore, when you have more than one organization in Ballerina Central, be sure to pick the organization name that you intend to push the package into and set that as the `org-name` in `Ballerina.toml` inside the project directory.

You need to build the package prior to pushing the package to Ballerina Central. The `ballerina` build command compiles and creates an executable binary file (i.e., a .balx file).

For more information on the `ballerina build` command run the following.

```bash
$ ballerina help build
```

> **Tip**: You can use `ballerina help <command-name>` for more information on any of the commands.

By default, the output filename for a package is the package name suffixed with `.balx`. The default output replaces the `.bal` suffix with `.balx`.

Build your package.

```bash
$ ballerina build <package-name>
```

Once that is done, push your package to Ballerina Central.

```bash
$ ballerina push <package-name>
```

For example, if you have a Ballerina package named `math`, the following command will push it to Ballerina Central.

```bash
$ ballerina push math
```

For more information on the `ballerina push` command run the following.

```bash
$ ballerina help push
```

## Run the Composer
Ballerina Composer is the integrated development environment (IDE) built from scratch along with the Ballerina language. It can be used to develop Ballerina programs in source and visual editing modes with additional features like debugging, tracing, and tryIt. 

### To start the Composer: 

#### Linux

In the command line, type `composer`.

#### Windows

Launch Ballerina Composer from start menu.

#### Mac 

Launch Ballerina Composer app from Applications.

### To edit a Ballerina file in Composer:

1. In the Composer, click **File** and choose **Open File**.

2. Navigate to your service and open it to view this in the Composer.

![Ballerina Composer](/img/docs-images/quick-tour-composer.png)

## Follow the Repo

<div class="cGitButtonContainer"><p data-button="iGitStarText">"Star"</p> <p data-button="iGitWatchText">"Watch"</p></div>

Star [GitHub repo](https://github.com/ballerina-platform/ballerina-lang)  and show appreciation to Ballerina maintainers for their work. Watch the repo to keep track of Ballerina issues.

## What's Next

Now that you have taken Ballerina around for a quick twirl, you can explore Ballerina more.

* Go through [Ballerina by Example](/learn/by-example/) to learn Ballerina incrementally with commented examples that cover every nuance of the syntax.
* See [Ballerina by Guide](/learn/by-guide/) for long form examples that showcase how to build different types of integrations using a complete development lifecycle including IDE configuration, packages, dependencies, coding, unit testing, deployment, and observability.
