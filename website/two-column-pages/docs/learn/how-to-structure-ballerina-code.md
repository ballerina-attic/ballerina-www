# How to Structure Ballerina Code
This document demonstrates the development of a Ballerina project and shows how to use the `ballerina` tool to fetch, build, and install Ballerina packages and commands with repositories that are local and remote.

Ballerina Central is a globally hosted package management system to discover, download, and publish packages.

The `ballerina` tool requires you to organize your code in a specific way. This document explains the simplest way to get up and running with a Ballerina installation.

## Overview
* Ballerina progammers can either place their code into a single source code file or in a *project* directory.
* A Ballerina *program* is a compiled and linked binary.
* A *package* is a directory that contains Ballerina source code files.
* A *repository* is versioned collections of compiled or source code *packages*.
* A *project* atomically manages a collection of *packages* and *programs*.

## Programs
A *program* is a runtime executable, ending with a `.balx` extension. A *program* is the transitive closure of one Ballerina package without including `ballerina/*` packages, since those are dynamically linked within Ballerina's runtime engine during execution. A *package* that is a *program* compiles into a file with a `.balx` extension, otherwise it is treated as a to-be-linked library that ends with a `.balo` extension.

The program's package must contain a `main()` function (a process entry point) or contain a `service` (a network-accessible API) to generate a `.balx` file.

A program can import dependent *packages* which are stored within a *repository*.

Suppose you have the following structure:

```
/local/ballerina/src
  sample.bal
```

and `sample.bal` contained both a `main()` entry point and a `service`:

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/log;

public function main() {
    io:println("Hello, World!");
}

service<http:Service> hello bind { port: 9090 } {
    sayHello (endpoint caller, http:Request req) {
        http:Response res = new;
        res.setPayload("Hello, World!");
        caller->respond(res) but { error e => log:printError(
                                   "Error sending response", err = e) };
    }
}
```

### Build and Run Programs
You can build a Ballerina program that contains a `main()` function or services to generate a `.balx` without running it:
```bash
$ cd /local/ballerina/src
$ ballerina build sample.bal

# This generates 'sample.balx'
```

You can build and run the `main()` function or services of a Ballerina file with:
```bash
# Run from any location
$ ballerina run /local/ballerina/src/sample.bal

# Run from within the local directory
$ cd /local/ballerina/src
$ ballerina run sample.bal
```

You can build and run any public function of a Ballerina file with:
```bash
# Run public function `add` from any location
$ ballerina run /local/ballerina/src/sample.bal:add

# Run public function `add` from within the local directory
$ cd /local/ballerina/src
$ ballerina run sample.bal:add
```

You can run the `main()` function or services in a generated `.balx` file with:
```bash
$ ballerina run sample.balx
```

You can run run any public function in a generated `.balx` file with:
```bash
$ ballerina run sample.balx:add
```

## Packages
A *package* is a directory that contains Ballerina source code files and are part of a namespace. Packages facilitate collaboration, sharing, and reuse. Packages can include functions, connectors, constants, annotations, services, and objects. Packages are shared among programs, projects, and users by being pushed into a repository.

Packages:

<ol>
<li>May or may not have a version</li>
<li>However, packages cannot be pushed into a registry for sharing without a version</li>
<li>Are referenced by `<org-name>/<package-name>` where `<org-name>` is a namespace from within a repository.</li>
</ol>

Package names can contain alphanumeric characters including dots `.`. Dots in a package name have no meaning other than the last segment after the final dot being used as a default alias within your source code.

### Importing Packages
Your Ballerina source files can import packages:

```ballerina
import [<org-name>]/<package-name> [as <identifier>];
```

When importing a package, you can use its functions, annotations and other objects in your code. You reference these objects with a qualified identifier followed by a colon `:`, such as `<identifier>:<package-object>`.

Identifiers are either derived or explicit. The default identifier is either the package name, or if the package name has dots `.` include, then the last word after the last dot. For example, `import ballerina/http;` will have `http:` be the derived identifer. The package `import tyler/net.http.exception` would have `exception:` as the default identifier.

You can have an explicit identifier by using the `as <identifier>` syntax.

```ballerina
import ballerina/http;

// The 'Service' object comes from the imported package.
service<http:Service> hello bind { port:9090 } {

    // The 'Request' object comes from the imported package.
    sayHello (endpoint caller, http:Request req) {
        ...
    }
}
```

Or you can override the default identifier:
```ballerina
import ballerina/http as network;

service<network:Service> hello bind { port:9090 } {

    // The 'Request' object comes from the imported package.
    sayHello (endpoint caller, network:Request req) {
        ...
    }
}
```

### Package Version Dependency
If your source file or package is a part of a project, then you can explicitly manage version dependencies of imported packages within the project by defining it in `Ballerina.toml`:

```toml
[dependencies."tyler/http"]
version = "3.0.1"
```

If an import statement does not explicitly specify a version, then the compiler will use the `latest` package version from a repository, if one exists.

```ballerina
import tyler/http;

public function main() {
  http:Person x = http:getPerson();
}
```

### Compiled Packages
A compiled package is the compiled representation of a single package of Ballerina code, which including transitive dependencies into the compiled unit.

Packages can only be created, versioned, and pushed into a repository as part of a *project*.

### Running Compiled Packages
An entrypoint such as a `main()` or a `service<>` that is compiled as part of a named package is automatically linked into a `.balx`. You can run the compiled package `.balx`:

```bash
ballerina run package.balx
```

You can also invoke any public function in a `.balx` by specifying the function to invoke after the `.balx`, with Ballerina run:

```bash
# Invoke the public function `add` in `sample.balx` 
$ ballerina run sample.balx:add
```


## Projects
* A *project* is a directory which atomically manages a collection of *packages* and *programs*. It has:
  * A user-managed manifest file, `Ballerina.toml`
  * A Ballerina-managed `.ballerina/` folder with implementation metadata and cache
  * A project repository for storing dependencies

Projects are atomically managed, so dependency management, compilation, unit tests, and artifact generation are done collectively across the source code files and packages defined within a project.

### Create a Project
You can create a project from any folder:

```bash
ballerina init [-i]
```

The command will initialize a simple project with a package inside of it. If the folder where this command is run has Ballerina source files or subfolders, those will be placed into the new project.

You can optionally run `init` in interactive mode where you can specify overrides for the default files and folders that are created. We will extend the `init` command in the future to be a general purpose template generator creating projects from templates defined by others than the Ballerina team.

### Create a Package
Each subdirectory of the project root folder defines a single package. The subdirectory's name will be used to name the package. Any additional subdirectories within the package have no semantic meaning and can be used by the developer for organizing files. The package subdirectories can have as many Ballerina source files and all will be included within the package when it is built.

The folders `.ballerina/`, `tests/`, and `resources/` are reserved folder names that can exist within the project root which are ignored as packages. These folders may also exist within a package and are ignored, instead treated as special case folders that contain unit tests or other files that must be included within a package.

### Project Structure
```
/
  .gitignore
  Ballerina-lock.toml  # Generated during build, used to rebuild identical binary
  Ballerina.toml       # Configuration that defines project intent
  .ballerina/          # Internal cache management and contains project repository
                       # Project repository is built or downloaded package dependencies

  main.bal             # Part of the “unnamed” package, compiled into a main.balx
                       # You can have many files in the "unnamed" package, though unadvisable

  package1/            # The source in this directory will be named “<org-name>/package1”
    Package.md         # Optional, contains descriptive metadata for display at Ballerina Central
    *.bal              # In this dir and recursively in subdirs except tests/ and resources/
    [tests/]           # Package-specific unit and integration tests
    [resources/]       # Package-specific resources

  packages.can.include.dots.inthe.dir.name/
    Package.md
    *.bal
    [tests/]         
    [resources/]     

  target/              # Compiled binaries and other artifacts end up here
      main.balx
```

Any source files located in the project root are assumed to be part of the unnamed package. They are each assumed to be entry points and compiled into `target/<file-name>.balx`. This structure is to simplify new development, but not recommended for large projects. Large projects should place the entrypoint or entry service into a named package.

### Build a Project
Building a project will build all projects and source files found in the project's root folder. Building a project runs through phases including dependency resolution, compilation, artifact generation, and unit test execution.

```bash
ballerina build
```

### Build a Package
You can build a single package contained within a project:

```bash
ballerina build <package-name>
```

### Version a Package
Packages in a project are assigned their version from within the `Ballerina.toml` file:

```toml
# The current version, obeying [semver](https://semver.org/)
version = “string”
```

All packages built in a project are assigned the same version. If you need two packages to have different versions, then those packages should be placed into different projects.

Version labels must follow [Semantic Versioning 2.0 rules](https://semver.org/).

### Assign an Organization Name to a Package
A package is assigned an `<org-name>` when it is pushed into a repository. The `<org-name>` is defined in the `Ballerina.toml` and all packages in the same project are assigned the same organization name:

```toml
# Org name assigned to packages when installed into a repository
org-name = “tyler”
```

## Repositories
A repository is a collection of packages. A repository helps organize packages used by multiple programs by managing their versions and assets in a central location.

There are four kinds of repositories:

1. Project Repository. This repository is located in a project's `.ballerina/` folder and contains installed versions of packages from the project and any dependencies of the project.  

2. Home Repository. This repository is located on a developer's machine at the location of `BALLERINA_HOME_DIR` or `~\.ballerina` if not specified.

3. System Repository. A special repository that is embedded within the Ballerina distribution which contains `ballerina/*` core packages.

4. Ballerina Central. Located at [http://central.ballerina.io](http://central.ballerina.io), this centrally managed repository is a community hub to discover, download, and publish Ballerina packages.

### Repository Precedence
When building a Ballerina program with a project, the build system will search repositories for any imported dependencies. Dependencies are searched in the system, then project, then home, then Ballerina Central repositories for the dependency. Once found, it will be installed into the project repository if not already present.

If a package is discovered at Ballerina Central, the build system will download the package's files before installing into the home repository for reuse.

### Package Installation
When building a package in a project, that package is automatically installed into the project's local repository. That package can be shared across other projects by installing it into the home repository.

The org-name and the version of the package will be read from the manifest file `Ballerina.toml` inside the project.

To install a single package in a project:
```bash
ballerina install <package-name>

# Alternate form:
ballerina push <package-name> --repository home
```

### Organizations
An organization is a logical name used for grouping packages together under a common namespace within a repository.

All packages installed into a repository must have an organization name. Any installation or pushing of a package into a repository will fail without an organization name.

Organization names can contain alphanumeric characters following identifier lexical rules similar to packages. None of the characters in an organization name have any semantic meaning.

The organization names `ballerina` and `ballerinax` are reserved for system use. Packages in the `ballerina` package are included within the system distribution and `ballerinax` are stored within Ballerina Central.

Remotely hosted repositories, such as Ballerina Central, can each have their own approach for assigning a user's organization name. At Ballerina Central, every account is assigned a personal organization name, which is chosen by a user when first creating their account or derived from the email address of the user.

When pushing a package from a local computer into a remote repository, such as Ballerina Central, the user's organization name in the remote repository MUST match the `<org-name>` assigned in the Ballerina.toml. If the names do not match, then the push operation will fail. This enforcement may seem arbitrary, however, it is a simple way to ensure organization naming consistency across remote and local development environments.

### Pulling Remote Packages
You can install packages that exist in a remote repository into your home repository through "pulling". Pulling a package discovers and downloads the package source and binaries from a remote repository and installs it into the home repository. The package will be pulled from Ballerina Central.

```bash
ballerina pull <org-name>/<package-name>[:<version>]
```

Projects that perform dependency analysis will automatically pull packages into the home repository.

### Pushing Packages Into Remote Repositories
"Pushing" a package uploads the associated package files and installs the package into a remote repository, which is Ballerina Central.

The org-name and the version of the package will be read from the manifest file `Ballerina.toml` inside the project.
```
# Push a single package
ballerina push <package-name>
```

Ballerina Central requires an account in order to push packages. Your account is represented by a CLI token that is installed into your local Ballerina configuration file, located at `~/.ballerina/Settings.toml`. The CLI token is automatically installed into this file the first time you perform a `ballerina push` as Ballerina redirects to an OAuth authorization screen, configures your account, and then copies your CLI key from Ballerina Central into your local CLI configuration.

Every push of the same package into Ballerina Central REQUIRES a new version, even for minor text updates. We enforce this policy to ensure that projects that make use of dependencies cannot experience accidental behavior drift across two versions of the same package given the same version. Essentially, there is no way to "update" a package for a specific version at Ballerina Central.
