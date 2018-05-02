# How to Extend Ballerina

Developers and third parties can extend the behavior of Ballerina and package these customizations for use by others. There are three ways to customize the behavior of Ballerina:

1. Package and distribute new client connectors to third party endpoints, such as databases, infrastructure and APIs.

2. Package and distribute new server listeners that services can bind to to embrace different protocols.

3. Add new annotations to Ballerina source files that the compiler can act on to alter binaries and generate artifacts.

## Create Client Connectors
A client connector is instantiated by developers when they create an `endpoint` object within their code. You can create your own connectors that are part of Ballerina packages that you push into a Ballerina registry, such as what is available at Ballerina Central.

To create a client connector, you:

1. Create a Ballerina package in a Ballerina project.

2. Create an object with an `init()` and `getClient()` function.

3. Implement the `init()` function, which is called when the user instantiates an endpoint.

4. Implement the `getClient()` function, which is called when the connection must be returned.

5. Build the package and push it into a registry for usage by others.

### The Twilio Connector
You can see the source code for this example at:

1. [Single file](https://github.com/muthulee/package-twilio-super-simple/blob/master/twilio/twilio_endpoint.bal) version (easier for reading).

2. [Multiple files](https://github.com/muthulee/package-client-endpoint-guide/tree/master/clientendpointsample) version (split across files following good project structure).

WSO2 has created a connector for Twilio and pushed it into Ballerina Central as `wso2/twilio`. You can find this connector on the command line:

```bash
ballerina search twilio
```

The Twilio connector reuses the HTTP client connector and adds some additional properties in order to create a programmable connection with a Twilio endpoint. A simple Ballerina program that would use this connector might be the following:

```ballerina
import ballerina/http;
import wso2/twilio;

function main(string[] args) {
    endpoint TwilioClient twilioClient {
        clientConfig:{
            auth:{
                scheme:"basic",
                username: "",
                password: ""
            }
        }
    };

    Account account = check twilioClient->getAccountDetails();
    io:println(account);
}
```

In this example, the endpoint is going to instantiate a `TwilioClient` object. This object takes an input parameter defined as a `clientConfig` object. The `clientConfig` object includes an `auth` object which is part of the `http:Client` connector, which is distributed as part of the standard library.

The Twilio connector then defines a custom function, `getAccountDetails()` which is called by the end user to interact with the endpoint. The package developer will also implement a `TwilioClient::init()` method which will be called when the endpoint is instantiated. This method establishes the connection to Twilio.

### The TwilioClient Object
The connector is a data structure that is represented by an `object`.

```ballerina
public type Client object {

    // Data structure that will hold config info and a connector
    public {
        TwilioConfiguration twilioConfig;
        TwilioConnector twilioConnector = new;
    }

    public function init (TwilioConfiguration twilioConfig);
    public function getClient () returns TwilioConnector;
};

// Part of the TwilioClient object and passed as an input parameter to
// the connector when it is instantiated
public type TwilioConfiguration {

    // This type is a record defined in the http system library
    http:ClientEndpointConfig clientConfig;
};

// The actual connector object, which also includes a reference to the
// standard connector that is in the http system library
public type TwilioConnector object {
    public {
        string accountSid;
        http:Client basicClient;
    }

    public function getAccountDetails() returns (Account|error);
};
```

### Implement the `init()` Function for the Connector
We now implement the method that will be called when an endpoint is instantiated. The function name is the object we created with `::init()` provided to reference that init method. The initialization method can accept a single parameter. When the end user calles the `endpoint` object, the record literals after the endpoint object will be mapped and passed in as the parameter to this method.

```ballerina

// Constant
@final string BASE_URL = "https://api.twilio.com/2010-04-01";

public function TwilioClient::init (TwilioConfiguration twilioConfig) {

    // Navigate our client object into the targets file of the http::Client object
    twilioConfig.clientConfig.targets = [{url:BASE_URL}];
    var usernameOrEmpty = twilioConfig.clientConfig.auth.username;
    string username;
    string password;
    match usernameOrEmpty {
        string usernameString => username = usernameString;
        () => {
            error err;
            err.message = "Username cannot be empty";
            throw err;
              }
    }
    var passwordOrEmpty = twilioConfig.clientConfig.auth.password;
    match passwordOrEmpty {
        string passwordString => password = passwordString;
        () => {
            error err;
            err.message = "Password cannot be empty";
            throw err;
        }
    }

    http:AuthConfig authConfig = {scheme:"basic", username:username , password:password};

    // We can reference the fields of the TwilioClient object
    self.twilioConnector.accountSid = username;
    twilioConfig.clientConfig.auth = authConfig;

    // Calling initialize of the embedded http client object
    self.twilioConnector.basicClient.init(twilioConfig.clientConfig);
}
```

### Implement the `getClient()` Function for the Connector
The `getClient()` function is called whenever the system needs to return an active connection to the end user developer for use in their code. We've already initialized the conneciton and its saved within the TwilioClient object.

```ballerina
public function TwilioClient::getClient () returns TwilioConnector {
    return self.twilioConnector;
}
```

### Implement Custom Functions For Endpoint Interaction
While the `TwilioClient` object implements `init()` and `getClient()`, if you want to explose custom actions for your end users to use against the connector, these are defined in the `TwilioConnector` object which was initialized and stored as a reference to the `TwilioClient` object. You can add as many or as few custom functions to this object.

In our example, we added a `getAccountDetails()` function that can be invoked as part of the endpoint by the end user:

```ballerina
// Account is a custom object that represents Twilio data return values.
// The -> represents making a non-blocking worker call over the network
// twilioClient is the end user's endpoint that uses the TwilioClient connector
// getAccountDetails() is our custom function
Account account = check twilioClient->getAccountDetails();
```

And within the package that includes your custom connector, we have these additional items that define the custom function:

```ballerina
// Constants
@final string ACCOUNTS_API = "/Accounts/";
@final string RESPONSE_TYPE_JSON = ".json";

public function TwilioConnector::getAccountDetails() returns (Account|error) {
    endpoint http:Client httpClient = self.basicClient;
    http:Request request = new();

    string requestPath = ACCOUNTS_API + self.accountSid + RESPONSE_TYPE_JSON;
    var response = httpClient -> get(requestPath, request);
    var jsonResponse = parseResponseToJson(response);
    match jsonResponse {
        json jsonPayload => { return mapJsonToAccount(jsonPayload); }
        error err => return err;
    }
}
```

And the `Account` record is also defined in the same file:

```ballerina
public type Account {
    string sid;
    string name;
    string status;
    string ^"type";    // type is a keyword and therefore escaped
    string createdDate;
    string updatedDate;
};
```

### Publish Your Connector
You can publish your custom connector for others to use into a Ballerina registry, such as Ballerina Central. You will need to have your connector as part of a package, and built using Ballerina's project and build management tooling.

Once you have built the package, you can `ballerina push <org-name>/<package-name>` and your package will be available at Ballerina Central for others to use. The `<org-name>` is defined in the `Ballerina.toml` that resides with the project and must match the organization name that is attached to your account at Ballerina Central. The `<package-name>` is defined by the folder that you placed the source code within the Ballerina project.

You will need to have an account at Ballerina Central and your CLI token from central placed into your Ballerina settings. The `ballerina deploy` command will initiate an OAuth flow that automates this for you, even if you do not already have an existing account on Ballerina Central.

For more information on how to structure the code you write, see [How to Structure Ballerina Code](/learn/how-to-structure-ballerina-code/).

### Learn More
You can create connectors for a range of protocols and interfaces, including those endpoints which are backed by proxies, firewalls, or special security parameters. You can also reuse existing connectors as part of your own endpoint implementation. The best way to learn about how to implement different kinds of connectors is to see the source for the connectors that ship as part of the standard library and with some of the packages built by the community:

1. A [Hello Gatsby client](https://github.com/muthulee/package-twilio-super-simple/blob/master/hello/hello_world_endpoint.bal), which is a minimal custom client.

2. ballerina/http Client [source code](https://github.com/ballerina-platform/ballerina-lang/blob/master/stdlib/ballerina-http/src/main/ballerina/http/client_endpoint.bal).

3. Source code for a [Salesforce client connector](https://github.com/wso2-ballerina/package-salesforce).

4. Source code for a [GitHub client connector](https://github.com/wso2-ballerina/package-github).

5. Source code for a [Jira client connector](https://github.com/wso2-ballerina/package-jira).

6. Source code for a [Sonaqube client connector](https://github.com/wso2-ballerina/package-sonarqube).

7. Source code for a [SCIM2 client connector](https://github.com/wso2-ballerina/package-scim2).

8. Source code for a [Gmail client connector](https://github.com/wso2-ballerina/package-gmail).

9. Source code for a [Google Spreadsheet client connector](https://github.com/wso2-ballerina/package-googlespreadsheet).

10. Source code for a [Twitter client connector](https://github.com/wso2-ballerina/package-twitter).

11. Source code for a [gRPC client connector](https://github.com/ballerina-platform/ballerina-lang/blob/master/stdlib/ballerina-grpc/src/main/ballerina/grpc/client_endpoint.bal).

12. Source code for a [MySQL client connector](https://github.com/ballerina-platform/ballerina-lang/blob/master/stdlib/database/ballerina-mysql/src/main/ballerina/mysql/mysql_endpoint.bal).

## Create Server Listeners

## Create Custom Annotations & Builder Extensions
Annotations decorate objects in Ballerina code. The Ballerina compiler parses annotations into an AST that can be read and acted upon. You can introduce custom annotations for use by others with Ballerina and package builder extensions that can act on those annotations. The builder can generate additional artifacts as part of the build process.

Custom annotations are how the `ballerinax/docker` and `ballerinax/kubernetes` packages work. They introduce new annotations such as `@docker` and `@kubernetes` that can be attached to different parts of Ballerina code. The builder detects these annotations and then runs a post-compile process that generates deployment artifacts for direct deployment to those environments.

### Special Notes
There are two caveats to building custom annotations:

1. Currently, the Ballerina Compiler is implemented in Java and you will need JDK 1.8 and maven.

2. End users will need to manually install the extension into Ballerina. We will have a release mid-year that enables packaging these extensions as part of a Ballerina project, so that it's included in any package's pushed to central.

### Custom Annotation HelloWorld
We will create a custom annotation `@hello:Greeting{}` with an attribute `salutation` that can be attached to a Ballerina service. The builder extension will read the annotation that is attached to a source file containing the text value and save it in another file. We'll ship this customization as a package that is pushed to Ballerina Central and available to end users by adding `import ballerinax/hello` to their source files.

The end user might write some code that would look like:

```ballerina
import ballerina/http;
import ballerinax/hello;

@hello:Greeting{
  salutation: "Guten Tag!"
}
service<http:Service> helloWorld bind {port:9091} {
   sayHello(endpoint outboundEP, http:Request request) {
       http:Response response = new;
       response.setStringPayload("Hello, World from service helloWorld ! \n");
       _ = outboundEP -> respond(response);
   }
}
```

If the end user saved this file as `hello_world.bal` then after building the file (with our custom build extension) will produce:

``` bash
$> tree
├── hello_world.bal
├── hello_world.balx
└── hello_world.txt
$> cat hello_world.txt
Guten Tag!
```

### Custom Annotation Getting Started
The source code and results for this example are on [GitHub](https://github.com/ballerinax/hello).

An annotation is a Ballerina code snippet that can be attached to some Ballerina code, and will hold some metadata related to that attached code. Annotations are not executable, but can be used to alter the behavior of some executable code.

Annotations can be attached to:
* Services
* Resources
* Functions
* Connectors
* Actions (of Connectors)
* TypeMappers
* Structs
* Constants
* Annotations
* Object
* Record
* Enum
* Transformer
* Endpoint

Ballerina has built-in a set of annotations such as @http:ServiceConfig, @http:ResourceConfig. These annotations are part of the standard library and shipped with each distribution of Ballerina. You can view the definitions of these annotations by browsing the package API reference.

A Ballerina "builder extension" is Java code that the build process will load and execute after the compilation phase. Builder extensions can act on any annotation information, whether those in the system library or custom annotations provided by you. Builder extensions that you write can register callbacks that act on annotations attached to different objects:

* `public abstract void init(DiagnosticLog var1)`
* `public void process(PackageNode packageNode)`
* `public void process(ServiceNode serviceNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(ResourceNode resourceNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(ConnectorNode connectorNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(ActionNode actionNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(StructNode serviceNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(ObjectNode objectNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(RecordNode recordNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(EnumNode enumNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(FunctionNode functionNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(VariableNode variableNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(AnnotationNode annotationNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(TransformerNode transformerNode, List<AnnotationAttachmentNode> annotations)`
* `public void process(EndpointNode endpointNode, List<AnnotationAttachmentNode> annotations)`
* `public void codeGenerated(Path binaryPath)`

### Create a Maven Project
We have a Maven arctetype that will create a sample template that can be used for writing the Ballerina builder extension.

```
mvn archetype:generate -DgroupId=ballerinax.hello
                       -DartifactId=hello-extension
		       -DarchetypeArtifactId=maven-archetype-quickstart
		       -DinteractiveMode=false
```

This will create a maven project in following structure.

```bash	
├── pom.xml
├── src
│   ├── main
│   │   └── java
│   │       └── ballerinax
│   │           └── hello
│   │               └── App.java
│   └── test
│       └── java
│           └── ballerinax
│               └── hello
│                   └── AppTest.java
└── target
```

In the `pom.xml`, add Ballerina IO as the parent:

```xml
    <parent>
        <groupId>io.ballerina</groupId>
        <artifactId>ballerina</artifactId>
        <version>0.970.0-beta4</version>
    </parent>
```

In the `pom.xml` add Ballerina's maven dependencies:

```xml
    <dependencies>
        <dependency>
            <groupId>org.ballerinalang</groupId>
            <artifactId>ballerina-lang</artifactId>
            <version>0.970.0-beta4</version>
        </dependency>
    </dependencies>
```

In the `pom.xml`, add Ballerina's repository information

```xml
<repositories>
   <repository>
       <id>wso2.releases</id>
       <name>WSO2 Releases Repository</name>
       <url>http://maven.wso2.org/nexus/content/repositories/releases/</url>
       <releases>
           <enabled>true</enabled>
           <updatePolicy>daily</updatePolicy>
           <checksumPolicy>ignore</checksumPolicy>
       </releases>
   </repository>
   <repository>
       <id>wso2.snapshots</id>
       <name>WSO2 Snapshot Repository</name>
       <url>http://maven.wso2.org/nexus/content/repositories/snapshots/</url>
       <snapshots>
           <enabled>true</enabled>
           <updatePolicy>daily</updatePolicy>
       </snapshots>
       <releases>
           <enabled>false</enabled>
       </releases>
   </repository>
</repositories>
```

Make sure you are able to build the project:

```bash
mvn clean install
```

### Create Custom Annotation Definition
In the maven project, create a hello-extension/src/main/ballerina/ballerinax/docker/annotation.bal file.

```bash
├── pom.xml
├── src
│   ├── main
│   │   ├── ballerina
│   │   │   └── ballerinax
│   │   │       └── docker
│   │   │           └── annotation.bal
│   │   └── java
│   │       └── ballerinax
│   │           └── hello
│   │               └── App.java
│   └── test
│       └── java
│           └── ballerinax
│               └── hello
│                   └── AppTest.java
└── target
```

The annotation is defined using Ballerina syntax in the `annotation.bal`:

```ballerina
package ballerinax.hello;

@Description {value:"THIS TEXT APPEARS IN API DOCS"}
@Field {value:"salutation: THIS TEXT APPEARS IN API DOCS"}
public type HelloConfiguration {
   string salutation;
};

@Description {value:"THIS TEXT APPEARS IN API DOCS"}
public annotation <service> Greeting HelloConfiguration;

// You can replace the <> value with different objects this annotation may attach to
```

##### Remove Some Unnecessary Files
Remove the archetype generated `App.java` and `AppTest.java` files. They are not needed.

##### Define an Extension Provider
Create `HelloExtensionProvider.java` class in `hello/src/main/java/org/ballerinax/hello` package. This class will implement `SystemPackageRepositoryProvider`.

```java
package org.ballerinax.hello;

import org.ballerinalang.annotation.JavaSPIService;
import org.ballerinalang.spi.SystemPackageRepositoryProvider;
import org.wso2.ballerinalang.compiler.packaging.repo.JarRepo;
import org.wso2.ballerinalang.compiler.packaging.repo.Repo;

/**
* This represents the Ballerina Hello extension package repository provider.
*/
@JavaSPIService("org.ballerinalang.spi.SystemPackageRepositoryProvider")
public class HelloExtensionProvider implements SystemPackageRepositoryProvider {

   @Override
   public Repo loadRepository() {
       return new JarRepo(SystemPackageRepositoryProvider.getClassUri(this));
   }
}
```

##### Update the pom.xml

Configure bsc plugin in the `pom.xml`:

```xml
<!-- For ballerina annotation processing -->
<resources>
   <resource>
       <directory>src/main/resources</directory>
       <excludes>
           <exclude>ballerina/**</exclude>
       </excludes>
   </resource>

   <!-- copy ballerina annotation sources to the jar -->
   <resource>
       <directory>${project.build.directory}/../src/main/ballerina</directory>
       <targetPath>META-INF/</targetPath>
   </resource>
</resources>
<plugin>
   <groupId>org.bsc.maven</groupId>
   <artifactId>maven-processor-plugin</artifactId>
   <version>2.2.4</version>
   <configuration>
       <processors>
           <processor>org.ballerinalang.codegen.BallerinaAnnotationProcessor</processor>
       </processors>
       <options>
           <nativeEntityProviderPackage>org.ballerinalang.net.generated.providers</nativeEntityProviderPackage>
           <nativeEntityProviderClass>StandardNativeElementProvider</nativeEntityProviderClass>
       </options>
   </configuration>
   <executions>
       <execution>
           <id>process</id>
           <goals>
               <goal>process</goal>
           </goals>
           <phase>generate-sources</phase>
       </execution>
   </executions>
</plugin>
```

Configure the maven shade plugin. This plugin manages the packaging of dependency jar files. The Ballerina Tools distribution contains all the dependency jars we have used in the plugin. Since we are copying the final jar to Ballerina tools, we are excluding the Ballerina dependencies from the final jar.

```xml
<plugin>
   <artifactId>maven-shade-plugin</artifactId>
   <version>2.4.3</version>
   <executions>
       <execution>
           <phase>package</phase>
           <goals>
               <goal>shade</goal>
           </goals>
           <configuration>
               <createDependencyReducedPom>true</createDependencyReducedPom>
               <minimizeJar>true</minimizeJar>
               <artifactSet>
                   <excludes>
                       <exclude>org.slf4j:slf4j-api</exclude>
                       <exclude>org.slf4j:slf4j-jdk14</exclude>
                       <exclude>com.fasterxml.jackson.dataformat:jackson-dataformat-yaml</exclude>
                       <exclude>com.fasterxml.jackson.core:jackson-databind</exclude>
                       <exclude>com.fasterxml.jackson.core:jackson-annotations</exclude>
                       <exclude>com.fasterxml.jackson.core:jackson-core</exclude>
                       <exclude>commons-lang:commons-lang</exclude>
                       <exclude>org.yaml:snakeyaml</exclude>
                       <exclude>org.ballerinalang:ballerina-lang</exclude>
                       <exclude>org.ballerinalang:ballerina-launcher</exclude>
                       <exclude>org.ballerinalang:ballerina-builtin</exclude>
                       <exclude>org.ballerinalang:ballerina-core</exclude>
                       <exclude>org.ballerinalang:ballerina-mime</exclude>
                       <exclude>org.ballerinalang:ballerina-logging</exclude>
                       <exclude>org.ballerinalang:ballerina-http</exclude>
                       <exclude>junit:junit</exclude>
                       <exclude>org.bsc.maven:maven-processor-plugin</exclude>
                   </excludes>
               </artifactSet>
               <filters>
                   <filter>
                       <artifact>*:*</artifact>
                       <excludes>
                           <exclude>META-INF/*.SF</exclude>
                           <exclude>META-INF/*.DSA</exclude>
                           <exclude>META-INF/*.RSA</exclude>
                       </excludes>
                   </filter>
               </filters>
           </configuration>
       </execution>
   </executions>
</plugin>
```

Configure Maven compiler plugin. Ballerina requires Java8 for the builder extensions.

```xml
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-compiler-plugin</artifactId>
   <version>3.7.0</version>
   <configuration>
       <source>1.8</source>
       <target>1.8</target>
   </configuration>
</plugin>
```

##### Verify the Annotation
Build the project and verify that the JAR file is built. The JAR file will contain your annotation definitions.

```bash
mvn clean install
```

The resulting `target/hello-extension-1.0-SNAPSHOT.jar` will have the annotation definitions.

Place the jar file at `<ballerina_tools_home>/bre/lib` of your Ballerina distribution.

You can now verify that the annotation is present even though we cannot react to it yet. Create a sample Ballerina file with your  annotation and make sure that Ballerina can compile the file without errors.

```ballerina
import ballerina/http;
import ballerinax/hello;

@hello:Greeting{salutation : "Guten Tag!"}
service<http:Service> helloWorld bind {port:9091} {
   sayHello(endpoint outboundEP, http:Request request) {
       http:Response response = new;
       response.setStringPayload("Hello, World from service helloWorld ! \n");
       _ = outboundEP -> respond(response);
   }
}
```

### Write the Build Extension Processor
Create `HelloPlugin.java` in `hello/src/main/java/org/ballerinax/hello` package. We will then implement the annotation methods that we want to act upon.

```java
package org.ballerinax.hello;

import org.ballerinalang.compiler.plugins.AbstractCompilerPlugin;
import org.ballerinalang.compiler.plugins.SupportedAnnotationPackages;
import org.ballerinalang.model.tree.AnnotationAttachmentNode;
import org.ballerinalang.model.tree.ServiceNode;
import org.ballerinalang.util.diagnostic.Diagnostic;
import org.ballerinalang.util.diagnostic.DiagnosticLog;
import org.wso2.ballerinalang.compiler.tree.BLangAnnotationAttachment;
import org.wso2.ballerinalang.compiler.tree.expressions.BLangRecordLiteral;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

/**
* Compiler plugin to generate greetings.
*/
@SupportedAnnotationPackages(
    // Tell compiler we are only interested in ballerinax.hello annotations.
       value = "ballerinax.hello"
)
public class HelloPlugin extends AbstractCompilerPlugin {
   private DiagnosticLog dlog;

   @Override
   public void init(DiagnosticLog diagnosticLog) {
       // Initialize the logger.
       this.dlog = diagnosticLog;
   }

   // Our annotation is attached to service<> objects
   @Override
   public void process(ServiceNode serviceNode, List<AnnotationAttachmentNode> annotations) {

       //Iterate through the annotation Attachment Node List
       for (AnnotationAttachmentNode attachmentNode : annotations) {
           List<BLangRecordLiteral.BLangRecordKeyValue> keyValues =
                   ((BLangRecordLiteral) ((BLangAnnotationAttachment) attachmentNode).expr).getKeyValuePairs();
           //Iterate through the annotations
           for (BLangRecordLiteral.BLangRecordKeyValue keyValue : keyValues) {
               String annotationValue = keyValue.getValue().toString();
               switch (keyValue.getKey().toString()) {
                   //Match annotation key and assign the value to model class
                   case "salutation":
                       HelloModel.getInstance().setGreeting(annotationValue);
                       break;
                   default:
                       break;
               }
           }
       }
   }

   @Override
   public void codeGenerated(Path binaryPath) {
       //extract file name.
       String filePath = binaryPath.toAbsolutePath().toString().replace(".balx", ".txt");
       String greeting = HelloModel.getInstance().getGreeting();
       try {
           writeToFile(greeting, filePath);
       } catch (IOException e) {
           // This is how you can report compilation errors, warnings, and messages.
           dlog.logDiagnostic(Diagnostic.Kind.ERROR, null, e.getMessage());
       }
   }

   /**
    * Write content to a File. Create the required directories if they don't not exists.
    *
    * @param context        context of the file
    * @param targetFilePath target file path
    * @throws IOException If an error occurs when writing to a file
    */
   public void writeToFile(String context, String targetFilePath) throws IOException {
       File newFile = new File(targetFilePath);
       // append if file exists
       if (newFile.exists()) {
           Files.write(Paths.get(targetFilePath), context.getBytes(StandardCharsets.UTF_8),
                   StandardOpenOption.APPEND);
           return;
       }
       //create required directories
       if (newFile.getParentFile().mkdirs()) {
           Files.write(Paths.get(targetFilePath), context.getBytes(StandardCharsets.UTF_8));
           return;
       }
       Files.write(Paths.get(targetFilePath), context.getBytes(StandardCharsets.UTF_8));
   }
}

```

The annotation value is read and cached in a singleton model class. Upon receiving the code generated event, we are extracting the output file name and write the value from the model class to a file.

Create `HelloModel.java` in `hello/src/main/java/org/ballerinax/hello` package.

```java
package org.ballerinax.hello;

/**
 * Model class to store greeting value.
 */
public class HelloModel {
    private static HelloModel instance;
    private String greeting;

    private HelloModel() {
        // Initialize with the default greeting.
        greeting = "Hello!";
    }

    public static HelloModel getInstance() {
        synchronized (HelloModel.class) {
            if (instance == null) {
                instance = new HelloModel();
            }
        }
        return instance;
    }

    public String getGreeting() {
        return greeting;
    }

    public void setGreeting(String greeting) {
        this.greeting = greeting;
    }
}
```

Create an file named `org.ballerinalang.compiler.plugins.CompilerPlugin` in `hello/src/main/resources/META-INF/services` directory. This file is read by the compiler and registers our `HelloPlugin.java` class as an extension. The events will be received by the registered classes. The file should contain the fully qualified Java class name of the builder extension.

```
org.ballerinax.hello.HelloPlugin
```

Rebuild the maven project and replace the jar file in `<ballerina_tools_home>/bre/lib` with the latest. You should now be able to compile the sample Ballerina file we created earlier. There should be a text file created with annotation value.

### Learn More About Java Libraries for Builder Extensions
First, the Ballerina developers will be eager and excited to help you if you run into any issues with writing Java extensions that parse the AST. AST parsing is a bit of a different world and it does take some work to learn all of the libraries. You can post questions on the ballerina-dev Google group, chat in our Slack channel, or post onto StackOverflow with the #ballerina label.

Second, the fastest way to learn about advanced annotation processing is to review the processors for Docker and Kubernetes.
Docker:

1. The [Ballerina file defining the annotation](https://github.com/ballerinax/docker/blob/master/src/main/ballerina/ballerinax/docker/annotation.bal).

2. The [Java code with the builder extension](https://github.com/ballerinax/docker/tree/master/src/main/java/org/ballerinax/docker).

Kubernetes

1. The [Ballerina file defining the annotation](https://github.com/ballerinax/kubernetes/blob/master/src/main/ballerina/ballerinax/kubernetes/annotation.bal).

2. The [Java code with the builder extension](https://github.com/ballerinax/kubernetes/tree/master/src/main/java/org/ballerinax/kubernetes).
