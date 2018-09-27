# Tools, IDEs and the Ballerina Composer

Ballerina provides several tools to help you create, document, and test your code. These tools can be various editors, IDEs, and a graphical visualization tool for your code called the Ballerina Composer.

These tools include the following.

- [IDE plug-ins](#ide-plug-ins)
- [Swagger to Ballerina code generator](#swagger-to-ballerina-code-generator)
- [API documentation generator](#api-documentation-generator)
- [Test framework](#test-framework)
- [Flexible composer](#flexible-composer)

## IDE plug-ins

You can use plug-ins to write Ballerina code in your favorite IDE. There are several plug-ins available in Github. Click one of the following links to learn how to use that IDE's plug-in. 

* [IntelliJ IDEA](https://github.com/ballerina-platform/ballerina-lang/tree/master/tool-plugins/intellij)
* [Visual Studio Code (VS Code)](https://github.com/ballerina-platform/ballerina-lang/tree/master/tool-plugins/vscode)

## Swagger to Ballerina code generator

You can use existing Swagger files to generate connectors and services in Ballerina code. For details, see the [Swagger to Ballerina Code Generator](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/swagger-ballerina/modules/swagger-to-ballerina-generator).

## API documentation generator

As you develop new connectors, actions, and functions that you want to share with others, it's important to add API documentation that describes each entity and how it's used. Ballerina provides a framework called **Docerina** that generates API documentation from your annotations in your Ballerina files. You can check it out [here](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/docerina). 

## Test framework

When you write your code in Ballerina Composer, the syntax is checked for you as you write it, and you can use the Debug button to step through your program. You can also manually test a Ballerina file using the following command:

```
./ballerina test <package_name>
```

Ballerina provides a testing framework called **Testerina** that you can use for your programs. You can check it out [here](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/testerina). 

## Flexible composer

The Ballerina Composer provides a flexible and powerful browser-based tool for creating and viewing your Ballerina programs. This is a revolutionary way of doing programming for integration due to its use of sequence diagrams, enabling you to architecturally view your code while designing your solution. The Ballerina Composer sets Ballerina apart from other integration paradigms due to its unique visual representation.

You can build your integrations by writing code and viewing the corresponding sequence diagrams using the Ballerina Composer. You can switch seamlessly between the Design view and Source view, and create your programs in the way that you like to work.

### Run the Composer

At the command prompt, type `composer`. The welcome page of Ballerina Composer appears. 
    
![Ballerina Composer](/img/docs-images/ballerina-composer.png)
    
Let's open a sample and take a look around. 

### Explore the Ballerina Composer

Once you have accessed the composer, you can have a look around using the available samples in the welcome page of the Ballerina Composer.

1. Click **Hello World Service**.

    The Hello World Service program appears in the Composer. This creates a .bal file in your local machine and opens up the source code along with a sequence diagram representation of the code.
    
    ![Ballerina Composer](/img/docs-images/quick-tour-composer.png)

    Notice the **Source View**, **Design View**, and **Split View** buttons in the lower right corner. These enable you to switch between views seamlessly.
    
    Notice that on the top of the **Design View** you have an **Edit** button containing the various constructs that you'll use to build your integration. When you select a construct it is drawn in the canvas. This is where you build your sequence diagrams that define your integration logic. These constructs are called `definitions`.
        
    ![Ballerina Composer - Design View](/img/docs-images/design-view.png)
    
    Some constructs have a **life line** of execution where you program the statements to be executed. This defines the flow of execution. The life line is represented by a vertical line in the default program or any other construct of the **echoService**. The plus icon that can be seen on the lifeline enables you to add `statements`.


2. You can run your program from the Composer itself. Click the **Run** button on the top menu of the Composer and choose whether you want to run your program or debug it.

3. Click the "x" to the right of "hello_world_service.bal" in the tab title to close this sample, and click **Don't Save** if prompted.
