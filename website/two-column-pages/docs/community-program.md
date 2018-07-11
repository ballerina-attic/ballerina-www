<script src="/js/ballerina-form.js"></script>
# Ballerina Quick Tour – Community Engagement

We are looking to encourage community engagement with Ballerina. We would love to hear from you what your experiences are with Ballerina. 

As a token of appreciation, if you try the Ballerina quick tour that follows and provide us with the related experience information, we would ship you a Ballerina t-shirt.

The quick tour includes:

- Install Ballerina
- Hello World with Ballerina
- Hello World Client
- Run the Composer
- Create a New Package
- Create a Calculator Service
- Create a Client for Calculator Service
- Push your Package to Ballerina Central
- Follow the Repo

<ol>
<li>Go through the quick tour and follow the instructions on various platforms.
  <ul class="lower-latin">
    <li>Platforms should include any Linux/Unix like operating systems, Mac OSX, and Windows</li>
   </ul>
</li>
<li>Report issues found. This requires the contributor to have a GitHub account.
  <ul class="lower-latin">
    <li><a href="https://github.com/ballerina-platform/ballerina-www/issues">https://github.com/ballerina-platform/ballerina-www/issues</a>  for issues related to quick tour itself</li>
    <li><a href="https://github.com/ballerina-platform/ballerina-lang/issues">https://github.com/ballerina-platform/ballerina-lang/issues</a> for issues related to Ballerina functionality</li>


   </ul>
</li>
<li>
Star and watch the GitHub repo <a href="https://github.com/ballerina-platform/ballerina-lang/stargazers">https://github.com/ballerina-platform/ballerina-lang/stargazers</a>. This again requires the contributor to have a GitHub account.
</li>
</ol>

Once you complete the quick tour, please fill in the following information so that we can ship you a T-Shirt.

## Request T-Shirt

<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 cInlineForm">
<form name="communityForm" class="communityForm" method="post" action="" id="cInlineForm">
    <ul>
   <li><input type="text" maxlength="50" value="" name="first_name" placeholder="First Name" title="First Name" class="cTextfieldstyle contact_first_name"></li>
   <li><input type="text" maxlength="50" value="" name="last_name" placeholder="Last Name" title="Last Name" class="cTextfieldstyle contact_last_name"></li>
   <li><input type="text" maxlength="50" value="" name="email" placeholder="Email" title="Email" class="cTextfieldstyle contact_email"></li>
   <li><input type="text" maxlength="50" value="" name="phone" placeholder="Phone" title="Phone" class="cTextfieldstyle contact_phone"></li>
   <li>
      <select class="cSelect shirtsize" name="shirtsize">
         <option value="XL">XL</option>
          <option value="L">L</option>
           <option value="M">M</option>
           <option value="S">S</option>

      </select>
   </li>
   <li><textarea type="text" maxlength="550" value="" name="issues" placeholder="List of GitHub issues you filed" title="List of GitHub issues you filed" class="cTextfieldstyle contact_issues"></textarea></li>

   <li><input type="text" maxlength="50" name="github_id" value="" placeholder="Your GitHub ID" class="cTextfieldstyle field_state contact_id" id="state_text" title="Your GitHub ID"></li>

   <li><textarea type="text" maxlength="550" value="" name="feedback" placeholder="Your feedback and thoughts on Ballerina " title="Your feedback and thoughts on Ballerina " class="cTextfieldstyle contact_feedback"></textarea></li>

   <li><input type="checkbox" value="1" name="field_optin" class="field_optin" id="field_optin">&nbsp;Yes, I would like to receive emails from Ballerina.io to stay up to date on new releases and updates.</li>
   <li><input type="hidden" class="tokenid" value="" name="tokenid">
     <input type="hidden" class="pdep" value="/142131/2018-06-26/5672jb" name="pdep">
     <input class="cSubmitButton" type="submit" value="Submit" name="cInline_submit" id="cInline_submit"></li>
   </ul>
</form>
</div>
<div class="clearfix"></div>

Following is the quick tour for you to follow and experience Ballerina.


## Install Ballerina

1. Go to [https://ballerina.io/downloads](https://ballerina.io/downloads).
2. Download current stable version of Ballerina for your operating system.
3. Follow the instructions given in [https://ballerina.io/learn/getting-started/#installing-ballerina](https://ballerina.io/learn/getting-started/#installing-ballerina) to set it up.

### Verify Installation

To check if the installation is done right, run the following command.

```ballerina -v ```

This should print the version of Ballerina you have installed.

``` Ballerina 0.980.0 ```

## Hello World with Ballerina

While you can implement a simple program with Ballerina in isolation, the best practice is to start a project with the `ballerina init` command.

<ol>
<li>Start your project by creating a new folder of your choice.
</li>
<li>Navigate to that folder on command line and run the following command.
<code>ballerina init </code>
You see a response confirming that your project is initialized.
<code> Ballerina project initialized </code>
This automatically creates a typical Hello World service for you.
</li>
<li>Start the service using the `ballerina run` command.
ballerina run hello_service.bal
You get the following output.
<code> ballerina: initiating service(s) in 'hello_service.bal'
ballerina: started HTTP/WS endpoint 0.0.0.0:9090 </code>
</li>
<li>Open a new command line to invoke the service using a HTTP client program such as cURL.</li>
<li>Invoke the service using an HTTP client.
  
<code> curl http://localhost:9090/hello/sayHello </code>

Tip: If you do not have cURL installed, you can download it from <a href="https://curl.haxx.se/download.html">https://curl.haxx.se/download.html</a>.

You get the following response.
<code>Hello Ballerina! </code></li>
</ol>

You just created a Ballerina project, started a service, invoked that service, and received a response.

## Hello World Client

Instead of using an HTTP client program such as cURL, you can implement a client program to invoke the service using Ballerina itself.





<ol>
<li>
Open a new command line and go to the same folder you created the service.
</li>

<li>
Create a new file named main.bal.
</li>

<li>
Edit the main.bal file using a text editor of your choice.
</li>

<li>
Copy and paste the following code into the file and save the file.
</li>

</ol>

``` ballerina
import ballerina/http;
import ballerina/log;
import ballerina/io;

endpoint http:Client clientEndpoint {
    url: "http://localhost:9090"
};

function main(string... args) {
    // Send a GET request to the Hello World service endpoint.
    var response = clientEndpoint->get("/hello/sayHello");

    match response {
        http:Response resp => {
            io:println(resp.getTextPayload());
        }
        error err => { log:printError(err.message, err = err); }
    }
}
```
<ol start="5">
<li>Go back to the command line where you created the main.bal file.</li>
<li>Make sure your hello_service.bal is running in another command line (note that we started this service before and did not stop it). If it is not running, you can run it again in a new command line with
<code> ballerina run hello_service.bal</code>.</li>
<li>
Run the main.bal file.

<code>ballerina run main.bal</code>

This will invoke the print the response

<code>Hello Ballerina!</code>

You just invoked the Hello World service written in Ballerina programming language using a client program written in Ballerina.
</li>
<li>Shut down the service. To do this, go to the command line where you ran the service and press ctrl+c keys together.
</li>
</ol>



## Run the Composer

Ballerina Composer is the integrated development environment (IDE) built from scratch along with the Ballerina platform. It can be used to develop Ballerina programs in source and visual editing modes.

To start the Composer:

1. In the command line, run
``` composer ```
2. Access the Composer.
You will be directed to the Composer, with a browser window of your default Web browser being automatically opened by the Composer.
If this was not automatically done, access the Composer with a browser window using the URL
[http://localhost:9091](http://localhost:9091)
3. In the Composer, click **File** and choose **Open Project**.
4. Navigate to your folder where you ran `ballerina init` to create your first service and open it to view the project in the Composer.

## Create a New Package

1. On the explorer pane, right click on the folder name that you opened as your project, and click on **New Folder**.
2. Name the folder **calculator**. This means that you are going to implement a Ballerina package named calculator.
3. Right click on the **calculator** folder and click on **New File**.
4. Name the new file **lib.bal**.
5. Double click on the **lib.bal** file to open the file. We will have the implementation of the calculator functions of add, subtract, multiply and divide in this lib.bal file.
6. Copy the following code and paste into the **lib.bal** file and save it.
``` ballerina
function add(float a, float b) returns (float) {
    return a + b;
}

function subtract(float a, float b) returns (float) {
    return a - b;
}

function multiply(float a, float b) returns (float) {
    return a * b;
}

function divide(float a, float b) returns (float) {
    return a / b;
}
```

<ol start="7">
<li>Right click on <b>calculator</b> folder and click on <b>New File</b>.</li>
<li>Name the new file <b>main.bal</b>.</li>
<li>Double click on the <b>main.bal</b> file to open the file.
We will have the implementation main function that implements the calculator in this file.
The main program goes in a loop and executes calculator operations until the user chooses to exit.
Only add and subtract functions are used in the sample implementation. You can implement multiply and divide operations in this sample on your own and test.</li>
  <li>Copy the following code and paste it into the <b>main.bal</b> file and save it.</li>
</ol>

``` ballerina
import ballerina/io;

function main(string... args) {

    int c = 0;
    while ( c != 5) {
        // print options menu to choose from
        io:println("Select operation.");
        io:println("1. Add");
        io:println("2. Subtract");
        io:println("3. Multiply");
        io:println("4. Divide");
        io:println("5. Exit");

        // read user's choice
        string choice = io:readln("Enter choice 1 - 5: ");
        c = check <int>choice;

        if (c == 5) {
            break;
        }

        // Read two numbers from user to be used for calculator operations
        var input1 = io:readln("Enter first number: ");
        float a = check <float>input1;
        var input2 = io:readln("Enter second number: ");
        float b = check <float>input2;

        // Execute calculator operations based on user's choice
        if(c == 1) {
            io:print("Add result: ");
            io:println(add(a, b));
        } else if(c == 2) {
            io:print("Subtract result: ");
            io:println(subtract(a, b));
        } else {
            io:println("Invalid choice");
        }   
    }
}

```
<ol start="11">
<li>Go back to the command line where you created the project. This is the parent folder of the calculator folder.</li>
<li>Run the program on the command line using the following command:
  
<code> ballerina run calculator </code>

This will run the calculator package’s main program interactively until you choose to quit with 5 as input.</li>
<li>Enter 1 as input, then enter two numbers to add and see the result. You may also test the subtract option.</li>
<li>Quit the main program by entering 5 as input.</li>
</ol>

## Create a Calculator Service

1. Right click on the **calculator** folder and click **New File**.
2. Name the new file **service.bal**.
3. Double click on the **service.bal** file.
We will have a REST service that provides a calculator service in this file.
The service takes in a JSON requests that provides the inputs to calculate on and the operation to execute.
This service only implements the add operation. You may extend this and implement the other operations as an exercise on your own.
4. Copy the following code and paste it into the **service.bal** file and save it.

``` ballerina

import ballerina/http;

endpoint http:Listener listener {
    port:9090
};

// Calculator REST service
@http:ServiceConfig { basePath: "/calculator" }
service<http:Service> Calculator bind listener {

    // Resource that handles the HTTP POST requests that are directed to
    // the path `/operation` to execute a given calculate operation
    // Sample requests for add operation in JSON format
    // `{ "a": 10, "b":  200, "operation": "add"}`
    // `{ "a": 10, "b":  20.0, "operation": "+"}`

    @http:ResourceConfig {
        methods: ["POST"],
        path: "/operation"
    }
    executeOperation(endpoint client, http:Request req) {
        json operationReq = check req.getJsonPayload();
        string operation = operationReq.operation.toString();

        any result = 0.0;
        // Pick first number for the calculate operation from the JSON request
        float a = 0;
        var input = operationReq.a;
        match input {
            int ivalue => a = ivalue;
            float fvalue => a = fvalue;
            json other => {} //error
        }

        // Pick second number for the calculate operation from the JSON request
        float b = 0;
        input = operationReq.b;
        match input {
            int ivalue => b = ivalue;
            float fvalue => b = fvalue;
            json other => {} //error
        }

        if(operation == "add" || operation == "+") {
            result = add(a, b);
        }

        // Create response message.
        json payload = { status: "Result of " + operation, result: 0.0 };
        payload["result"] = check <float>result;
        http:Response response;
        response.setJsonPayload(untaint payload);

        // Send response to the client.
        _ = client->respond(response);
    }
}

```



<ol start="5">
<li>Go back to the command line where you created the project. This is the parent folder of the calculator folder.   </li>
<li>Run the service on the command line using the following command:
  
<code> ballerina run calculator </code>
Inside the calculator package, you now have both a main program that you previously wrote and the service that you just wrote.
When Ballerina is run for the calculator package, the main program is run, and the service is started.</li>
<li>Open a new command line to invoke the service using an HTTP client program such as cURL.</li>
<li>Invoke the service using an HTTP client.
<code> curl -v -X POST -d '{"a": 10, "b":  200, "operation": "add"}' "http://localhost:9090/calculator/operation" -H "Content-Type:application/json" </code>
</li>
</ol>

## Create a Client for Calculator Service

1. Right click on the package folder, that is the root folder that contains the **calculator** folder and click on **New File**.
2. Name the new file **client.bal**.
3. Double click on the **client.bal** file.
We will have the implementation a REST client to invoke calculator service in this file.
The client sends a JSON request that provides the input to calculate on and the operation (in this case, we execute the add operation) to execute to calculator service, receives the result and prints that.
4. Copy the following code and paste it into the **client.bal** file and save it.
5. Before going ahead, delete **main.bal** from the package folder if it still exists.

``` ballerina

import ballerina/http;
import ballerina/io;
import ballerina/log;

endpoint http:Client clientEndpoint {
    url: "http://localhost:9090"
};

function main(string... args) {

    http:Request req = new;

    // Set the JSON payload to the message to be sent to the endpoint.
    json jsonMsg = { a: 15.6, b: 18.9, operation: "add" };
    req.setJsonPayload(jsonMsg);

    var response = clientEndpoint->post("/calculator/operation", req);
    match response {
        http:Response resp => {
            var msg = resp.getJsonPayload();
            match msg {
                json jsonPayload => {
                    string resultMessage = "Addition result " + jsonMsg["a"].toString() +
                        " + " + jsonMsg["b"].toString() + " : " +
                        jsonPayload["result"].toString();
                    io:println(resultMessage);
                }
                error err => {
                    log:printError(err.message, err = err);
                }
            }
        }
        error err => { log:printError(err.message, err = err); }
    }
}

```

<ol start="6">
<li>Open a new command line to invoke the client program. Go to the project root folder, which is the parent folder of the calculator folder.</li>
<li>Run the client program to invoke the calculator service.
  
<code> ballerina run client.bal </code>

This will invoke the service, and print the result
<code> Addition result 15.6 + 18.9 : 34.5 </code>
</li>
</ol>

## Push your Package to Ballerina Central

Visit [https://central.ballerina.io/](https://central.ballerina.io/) and sign up. You can click **Sign U** action on the top right corner of the website and use an existing Google account or a GitHub account of yours to sign up.

Once you sign up, you will be asked to create an organization for you on [https://central.ballerina.io/create-organization](https://central.ballerina.io/create-organization). You may use your name or another name of your choice as the organization name.

Once you create an organization, you will be taken to your dashboard [https://central.ballerina.io/dashboard](https://central.ballerina.io/dashboard). There you can find your Ballerina token to access the Ballerina Central site from your computer to push packages. The `ballerina push` command uploads your package into Ballerina Central so that you can share your package with other developers.

For the `ballerina push` command to work, you need to copy and paste your Ballerina Central access token into `Settings.toml` in your home repository `<USER_HOME>/.ballerina/`. To do this, click on the copy button in front of the text box displaying the token on your Ballerina Central dashboard. Then go to your user home on a command line and go into the .ballerina folder and paste the token you copied into a file with the name Settings.toml. Since you are a new user, there would not be such file in there already, so you will have to create on in there.

When you push a package to Ballerina Central, the runtime validates organization name you have on Ballerina Cantal for the user against the `org-name` defined in your project’s `Ballerina.toml` file. You need to add organization name into this file.
To do this, go to the folder where you created your calculator package. Then create a file with the name Ballerina.toml and add in there the following. Note that this file in not within the calculator folder, but rather outside that at the same level of calculator folder (which is also referred to as Ballerina project home) You may also use the composer to create a new file, name that Ballerina.toml and add the following content using composer.

```
[project]
org-name = "sami"
version = "0.1.0"

```

You also need to have a Package.md file inside your package that describes the package before you push the package into Ballerina Central.
You can either create this on command line or using composer, right click on calculator folder select New File and name that to Package.md. Add some meaningful content to help document the package in this file.
For example
Example calculator package.

```
Contains basic arithmetic operations
(add, subtract, multiply, divide)
a sample menu driven main program to test, and a
sample REST service with JSON input/output to
invoke calculator as a service
```

Next, you need to do a build of the package before bushing the package into Ballerina Central.

``` ballerina build calculator ```

Now you can push the package to Ballerina Central

``` ballerina push calculator ```

You will get a confirmation message similar to

``` <org-name>/calculator:0.1.0 [project repo -> central] ```

Now you can go to your dashboard on Ballerina Central and view the package
[https://central.ballerina.io/manage-organization#packages](https://central.ballerina.io/manage-organization#packages)

You may also go to the package landing page directly to view the package details. Make sure to replace <org-name> with your organization name in the following URL
[https://central.ballerina.io/<org-name>/calculator](https://central.ballerina.io/<org-name>/calculator)

## Follow the Repo

<div class="cGitButtonContainer"><p id="iGitStarText">"Star"</p> <p id="iGitWatchText">"Watch"</p></div>

Ballerina source repository lives on GitHub.

You can view the source repo at [https://github.com/ballerina-platform/ballerina-lang](https://github.com/ballerina-platform/ballerina-lang).

It is a good community practice to star a GitHub repository and show appreciation to maintainers of a project for their work. You may star Ballerina project on GitHub.

To, do this, you need a GitHub account. If you do not have one already, visit the following URL and follow the instructions given in the form and create a GitHub account for you.
[https://github.com/join](https://github.com/join)
(**Note**: You do not need to follow step 2 and 3 in the GitHub join process as those are optional)

Now visit
[https://github.com/ballerina-platform/ballerina-lang/stargazers](https://github.com/ballerina-platform/ballerina-lang/stargazers)
Click on the **Star** button at the top right corner just below the dark site header. If successfully done, **Star** will change to **Unstar**.

You may also click the **Watch** button that appears to the left of the **Star** action. Watching the repo will help you keep track of Ballerina issues. If successfully done, **Watch** will change to **Unwatch**.

## Clean Up and Wrap Up

Congratulations!

You have just finished your first project with Ballerina programming language.

If you wish to uninstall Ballerina, you may follow instructions in [https://ballerina.io/learn/getting-started/#uninstalling-ballerina](https://ballerina.io/learn/getting-started/#uninstalling-ballerina)
