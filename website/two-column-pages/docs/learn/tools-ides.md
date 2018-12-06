# Tools and IDEs

Ballerina provides several tools to help you create, document, and test your code. These tools can be various editors, IDEs and a graphical visualization tool that is embedded in the Ballerina Visual Studio Code plugin.

These tools include the following.

- [IDE plug-ins](#ide-plug-ins)
- [Swagger to Ballerina code generator](#swagger-to-ballerina-code-generator)
- [API documentation generator](#api-documentation-generator)
- [Test framework](#test-framework)

## IDE plug-ins

You can use plug-ins to write Ballerina code in your favorite IDE. There are several plug-ins available in Github. Click on the following links to learn how to use that IDE's plug-in. 

* [Visual Studio Code (VS Code)](https://marketplace.visualstudio.com/items?itemName=ballerina.ballerina)
* [IntelliJ IDEA](https://plugins.jetbrains.com/plugin/9520-ballerina)

## Swagger to Ballerina code generator

You can use existing Swagger files to generate connectors and services in Ballerina code. For details, see the [Swagger to Ballerina Code Generator](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/swagger-ballerina/modules/swagger-to-ballerina-generator).

## API documentation generator

As you develop new connectors, remote functions in connectors and other functions that you want to share with others, it's important to add API documentation that describes each entity and how it's used. Ballerina provides a framework called **Docerina** that generates API documentation from the annotations in your Ballerina files. You can check it out [here](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/docerina). 

You can generate docs for a Ballerina file or module using the following command:

```
./ballerina doc [<ballerina-file>|<module-name>]
```

## Test framework

When you write your code in any of the aforementioned IDEs, the syntax is checked for you as you write it. You can use the debug button to step through your program. Ballerina provides a testing framework called **Testerina** that you can use for your programs. You can check it out [here](https://github.com/ballerina-platform/ballerina-lang/tree/master/misc/testerina).

You can test a Ballerina file or module using the following command:

```
./ballerina test [<ballerina-file>|<module-name>]
```
