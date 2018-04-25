# Quick Tour

Now that you know a little bit [about Ballerina](/philosophy), let's take it for a spin! 

## Install Ballerina

1. Go to [https://ballerina.io/](/) and click **Download Ballerina**. 
1. Download Ballerina for your OS and follow the instructions given to set it up. 

> **Note**: Throughout this documentation, `<ballerina_home>` refers to the Ballerina directory you just installed. 

## Start a Project, Run a Service, and Call It

Start your project by navigating to a directory of your choice and running the following command.

```bash
ballerina init
```

You see a response confirming that your project is initialized. This automatically creates a typical Hello World service for you. You can run the service by using a run command.

```bash
ballerina run hello_service.bal
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

> **Tip**: If you do not have cURL installed, you can download it from https://curl.haxx.se/download.html.

You get the following response.

```
Hello Ballerina!
```

You just started Ballerina, created a project, started a service, and received a response.

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

You can find a plugin for Ballerina in the VS Code marketplace. This helps read the `.bal` file using an ideal theme. 

### Annotations

Check if annotations work by entering some text and seeing proposed suggestions.

![VS Code Annotations](/img/docs-images/vscode_annotations.png)

Add the following annotation before the service to ensure that it is at the root path. This overwrites the default base path, which is the service name.

```ballerina
@http:ServiceConfig {
   basePath: "/"
}
```

Make the resource available at the root as well and change methods to POST. Add the following code snippet inside the service

```ballerina
   @http:ResourceConfig {
       methods: ["POST"],
       path: "/"
   }
```

> **Tip:** You can use your [favourite editor to work on Ballerina code](https://github.com/ballerina-platform/ballerina-lang/blob/master/docs/tools-ides-ballerina-composer.md).

## Use a Connector

Ballerina Central stores numerous connectors that can be used with your service. Search for a Twitter connector.

```
ballerina search twitter
```

This results in a list of available connectors. You can pull the one you want from Ballerina Central.

```
ballerina pull wso2/twitter
```

You now have access to a Twitter connector.

In your `hello_service.bal` file, import the Twitter package.

```ballerina
import wso2/twitter;
```

> **Note**: You can import the package and use it without using `ballerina pull`. `ballerina pull` ensures code completion.

You can now use Ballerina to integrate with Twitter.

## Send a Tweet

### Before you Begin

Prior to sending a Tweet, you need to create a Twitter app and get some information from Twitter.

> **Note**: You need to have a Twitter account to try this.

1. Go to https://apps.twitter.com/ and click **Create New App**. 

2. Fill the form that appears and click **Create your Twitter application**.

3. Once your app is created, navigate to the **Keys and Access Tokens** tab. Make note of the **Consumer Key (API Key)** and **Consumer Secret (API Secret)**. Generate an access token in the **Your Access Token** section by clicking **Create my access token**.

4. In the directory where you have your service, create a **twitter.toml** file and add the details you obtained above within the quotes.
    ```
    # Ballerina demo config file
    clientId = ""
    clientSecret = ""
    accessToken = ""
    accessTokenSecret = ""
    ```

Now you can program Ballerina to send in a tweet.

### Program Ballerina to Send a Tweet

In your `hello_service.bal` file, import the Twitter package.

```ballerina
import ballerina/config;
```

Add this code after the import.

```ballerina
endpoint twitter:Client twitter {
   clientId: config:getAsString("clientId"),
   clientSecret: config:getAsString("clientSecret"),
   accessToken: config:getAsString("accessToken"),
   accessTokenSecret: config:getAsString("accessTokenSecret"),
   clientConfig:{}   
};
```

Now you have the Twitter endpoint.

In the `sayHello` function, add the following to get the payload as a string.

```ballerina
string status = check request.getStringPayload();
```
> **Tip**: The check keyword means that this may return an error but I do not want to handle it here - pass it further away (to the caller function, or if this is a top-level function - generate a runtime failure.

Now, we can get our response from Twitter by just calling its tweet method. Add this into the `sayHello` function as well.

```ballerina
twitter:Status st = check twitter->tweet(status,"","");
```

Go ahead and run it and this time pass the config file:

```bash
$ ballerina run demo.bal --config twitter.toml
```

Now go to the terminal window and pass a tweet:

```bash
$ curl -d "Ballerina" -X POST localhost:9090
```

You send a tweet that says 'Ballerina'.

## Deploying on Docker

Now that your service is created, you can deploy this on Docker. 

> **Tip**: This was tested on the community edition version of Docker Edge.

Import the docker package.

```
import ballerinax/docker;
```

Now, let’s add the code you need to run the service in Docker.

```ballerina
// Docker configurations
@docker:Config {
    registry:"docker.abc.com",
    name:"helloworld",
    tag:"v1.0"
}
```

Now your code is ready to generate deployment artifacts. In this case it is a docker image.
```bash
$> ballerina build hello_world_docker.bal
@docker 		 - complete 3/3
Run following command to start docker container: 
docker run -d -p 9090:9090 docker.abc.com/helloworld:v1.0
```

```bash
$> tree
.
├── README.md
├── docker
│   └── Dockerfile
├── hello_world_docker.bal
└── hello_world_docker.balx
```

```bash
$> docker images
REPOSITORY                 TAG                 IMAGE ID            CREATED              SIZE
docker.abc.com/helloworld   v1              df83ae43f69b        2 minutes ago        102MB
```

You can run a docker container and access it with your code by just copying and pasting the docker run command that displays as output of the Ballerina build command.

```bash
docker run -d -p 9090:9090 docker.abc.com/helloworld:v1.0
130ded2ae413d0c37021f2026f3a36ed92e993c39c260815e3aa5993d947dd00
```

```bash
docker ps
CONTAINER ID        IMAGE                            COMMAND                  CREATED                  STATUS              PORTS                    NAMES
130ded2ae413        docker.abc.com/helloworld:v1.0   "/bin/sh -c 'balleri…"   Less than a second ago   Up 3 seconds        0.0.0.0:9090->9090/tcp   thirsty_hopper
```

Access the hello world service hosted on docker with a cURL command.

```bash
curl http://localhost:9090/helloWorld/sayHello
```
You get the following response.

```
Hello, World!
```

## Push your Package to Ballerina Central

For the `ballerina push` command to work, you need to copy and paste your Ballerina Central access token in Settings.toml in your home repository (<USER_HOME>/.ballerina/). 

Register on Ballerina central and visit user dashboard at https://central.ballerina.io/dashboard to gain access to your user token.  

Once that is done, push your package to Ballerina Central.

```bash
ballerina push quicktour/twitter
```

## Run the Composer

1. In the command line, type `composer`.

2. Access the Composer from the following URL in your browser: `http://localhost:9091`

3. In the Composer, click **File** and choose **Open File**.

4. Navigate to your service and open it to view this in the Composer.
