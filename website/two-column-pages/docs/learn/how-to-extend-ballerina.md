# How to Extend Ballerina 

Developers and third parties can extend the behavior of Ballerina and package these customizations for use by others. There are three ways to customize the behavior of Ballerina:
1. Package and distribute new client connectors to third party endpoints, such as databases, infrastructure and APIs.
2. Package and distribute new server listeners that services can bind to to embrace different protocols.
3. Add new annotations to Ballerina source files that the compiler can act on to alter binaries and generate artifacts.

## Create Client Connectors

## Create Server Listeners

## Create Custom Annotations
Annotations decorate objects in Ballerina code. The Ballerina compiler parses annotations into an AST that can be read and acted upon. You can introduce custom annotations for use by others with Ballerina and package compiler extensions that can act on those annotations. The compiler can modify the resulting binary and generate additional artifacts as part of the build process.

Custom annotations are how the `ballerinax/docker` and `ballerinax/kubernetes` packages work. They introduce new annotations such as `@docker` and `@kubernetes` that can be attached to different parts of Ballerina code. The compiler detects these annotations and then runs a post-compile process that generates deployment artifacts for direct deployment to those environments. 
