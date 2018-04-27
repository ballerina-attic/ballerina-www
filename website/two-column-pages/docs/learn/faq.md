# FAQs

### What is the purpose of the project?
Ballerina is an approach to addressing the integration gap between integration products and general purpose programming languages. Integration products, like ESBs and BPMN, are integration simple but not agile and general purpose programming languages are agile but not integration simple.

Customer demand has led to the rise of companies like Google, Uber, and Amazon. They have had to build complex systems to meet that demand. If you look at how those companies have evolved, they have increasingly disaggregated their architectures in order to scale.

This is a continuation of a trend that we have seen over five decades. Massively disaggregated approaches like microservices, serverless, and APIs are becoming the norm.

We have seen these disaggregated components become network accessible. We call them endpoints. Whether it is data, apps, APIs, microservices, or serverless functions, everything is becoming a programmable endpoint. The number of endpoints is exploding.

The apps we will write increasingly depend on these endpoints. Integration is the discipline of resilient communication between endpoints. It isn’t easy. The challenges include compensation, transactions, events, circuit breakers, discovery, and protocol handling, and mediation. These are all hard problems.

There have been two ways to handle integration.

* One approach has used integration products based on configuration, not code. We’ve created EAI, ESBs, and DSLs as integration-first stacks. These approaches aren’t agile. They disrupt the edit, build, run, test cycle interrupting a developer’s flow. And that isn’t the experience we desire as developers.
* The other way to do integration is with general purpose programming languages, like Java and JavaScript. These languages provide agility to offer developer flow. However, developers have to take responsibility for solving the hard problems of integration. They do this by writing their own integration logic or by using complex bolt-on frameworks like Spring or Node. This approach is agile, but not integration simple.

This is a fundamental problem - you can have integration simple or agile, but not both. We call this the integration gap.

We believe that a new programming language and platform is required - a general purpose, concurrent, transactional and statically & strongly typed programming language with both textual and graphical syntaxes. Its specialization is integration - it brings fundamental concepts, ideas and tools of distributed system integration into the language and offers a type safe, concurrent environment to implement such applications. These include distributed transactions, reliable messaging, stream processing, workflows and container management platforms.

Ballerina’s concurrency model is built on the sequence diagram metaphor and offers simple constructs for writing concurrent programs. Its type system is a modern type system designed with sufficient power to describe data that occurs in distributed applications. It also includes a distributed security architecture to make it easier to write applications that are secure by design.

Ballerina is designed for modern development practices with a modularity architecture based on packages that are easily shared widely. Version management, dependency management, testing, documentation, building and sharing are part of the language design architecture and not left for later add-on tools.

The Ballerina standard library is in two parts: the usual standard library level functionality (akin to libc) and a standard library of network protocols, interface standards, data formats, authentication/authorization standards that make writing secure, resilient distributed applications significantly easier than with other languages.

Ballerina has been inspired by Java, Go, C, C++, Rust, Haskell, Kotlin, Dart, Typescript, Javascript, Swift and other languages.

### What is the status of the project?

Ballerina became a public open source project on February 21s, 2017, hosted at http://ballerinalang.org and http://github.com/ballerinalang/ballerina.

Through 2017 and the first part of 2018, the language was redesigned based upon feedback from the community. In Q2 2018, Ballerina was moved to http://ballerina.io and http://github.com/ballerina-platform/.

The current revision of Ballerina is pre-1.0. However, stability is happening quickly, and 1.0 language-lock was established with the .970 version in April 2018.

The Ballerina project is currently working towards Ballerina 1, which includes a language specification, a virtual machine, standard libraries, build management, centralized package management at central.ballerina.io, unit test framework, and observability extension.

Ballerina is currently community supported on Stack Overflow, and WSO2 is working towards offering commercial support in 2018.

There may be a Ballerina 2 one day, but not for many years, as we will work to use Ballerina to develop programs, products, and tools rather than actively change the language and libraries. The purpose of Ballerina 1 is to provide long-term stability. Backwards-incompatible changes will not be made to any Ballerina 1 point release. Of course, development will continue on Ballerina itself, but the focus will be on performance, reliability, portability and the addition of new functionality, such as streams and stateful orchestrations.

### What is the origin of the logo?

The Ballerina logo and the shoes, which are “en pointe”, were designed by Eric and Christine Strohl, of StrohlSF.com.

### Why are you creating a new language?

Ballerina was born out of frustration with programming frameworks and integration products that embed programming logic within YAML, XML, or other configuration-based files. These approaches disrupted the developer flow, requiring special purpose tools and debuggers that took developers away from focusing on iterative development.

One had to either choose robust, complex, and heavy server products for managing integrations, or use a general purpose language with a bolt-on framework that varied by programming language and objectives. There has not existed a way to get agility with rapid code development that runs micro-integration servers for message brokering, service hosting, and transaction coordination.

Ballerina is an attempt to combine the agility of a type safe programming language with the syntax of integration sequence diagrams. Once compiled, the resulting binaries embed micro engines that perform inline integration semantics such as mediation, orchestration, transformations, asynchrony, event generation and transactions.

Finally, working with Ballerina is intended to be cloud native - the language has constructs that define the architectural environment so the compiler understands the logical environment the application will be running within. This enables the compiler to generate numerous runtime environment artifacts that are typically generated by continuous integration solutions.

### What are Ballerina’s ancestors?

In the creation of Ballerina, we were inspired by so many technologies. Thank you to all that have come before us (and forgive us if we missed one): Java, Go, C, C++, Rust, Haskell, Kotlin, Dart, TypeScript, JavaScript, Flow, Swift, RelaxNG, NPM, Crates, Maven, Gradle, Kubernetes, Docker, Envoy, Markdown, GitHub, and WSO2. We used many technologies to build the tools and the website: Bootstrap, JQuery, React JS, MkDocs, Microsoft VS Code, Jetbrains IntelliJ, Eclipse Che and Jenkins. The package management system is inspired by Docker and Elm. However, it is a new language. In every respect the language was designed by thinking about what integration programmers do and how to make integration programming agile, more effective, and more fun.

### What are the guiding principles in the design?

There are a few principles that drove the design of the language and runtime:
* Sequence Diagrammatic - Ballerina’s underlying language semantics were designed by modeling how independent parties communicate via structured interactions. Subsequently, every Ballerina program can be displayed as a sequence diagram of it’s flow with endpoints, including synchronous and asynchronous calls. The Ballerina Composer is an included tool for creating Ballerina services with sequence diagrams. Sequence diagrams are a reflection of how designers and architects think and document interconnected systems. Ballerina’s syntax is structured to let any tool or system derive a sequence diagram, and subsequently the way a developer thinks when writing Ballerina code encourages strong interaction best practices. This theory is elaborated upon in Sanjiva Weerawarana’s blog.
* Concurrency Workers - Ballerina’s execution model is composed of lightweight parallel execution units known as workers. Workers use a full non-blocking policy where no function locks an executing thread, such as an HTTP I/O call awaiting response. These semantics manifest sequence concurrency where workers are independent concurrent actors that do not share state but can interact using messages. Workers and fork/join language semantics abstract the underlying non-blocking approach to enable a simpler concurrency programming model.
* Network Aware Type Safety - Ballerina has a structural type system with primitive, object, union, and tuple types. Network systems return messages with different payload types and errors. Ballerina’s type system embraces this variability with an approach based on union types. This typesafe model incorporates type inference at assignment provide numerous compile time integrity checks for network-bound payloads.  Ballerina has a structural type system with primitive, object, union, and tuple types. Network systems return messages with different payload types and errors. Ballerina’s type system embraces this variability with an approach based on union types. The model then incorporates type inference at assignment to provide compile time integrity checks for network-bound payloads.  
* DevOps Ready - Over the past 15 years, best practices and expectations on the associated toolset that a language provides have evolved. Now, a language is not ready for adoption unless it includes unit test framework, build system, dependency management and versioning, and a way to share modules of reusable code. Ballerina includes all of these subsystems as part of its core distribution so that there is no risk of community drift, which is what happens when the ecosystem needs to build tools on top of a language instead of designing it within the language.
* Environment Aware - Ballerina the language and its components are intended to be used within distributed, event-driven architectures. Subsequently, each service written within Ballerina is residing in an environment that may also include other services, legacy services, service meshes, orchestrators, API gateways, identity gateways, message brokers and databases. Ballerina’s language and annotations extension are intentionally environment-aware, treating these other components as syntactical objects and also relationships as decorated annotations. By having the language and build system be environmentally aware of other components surrounding our service, we can generate essential artifact code ahead of CI/CD, perform data and integrity checks around network-bound payloads, and pre-package dependent but not yet deployed components as part of the Ballerina binary.

### How does Ballerina compare to Spring?
Ballerina is a modern programming language that has a concise way of programming interaction scenarios. Its syntax represents the powerful elements of what Java, Spring, and Spring Cloud offer separately. Additionally, Spring requires developers to choose and configure a separate build system (maven or gradle), unit test framework, registry for sharing modules, and deployment artifact generation. The nature of agile programming has evolved where these lifecycle concepts for microservices are well understood and their best practices are baked into Ballerina in the form of Ballerina’s build system, Ballerina Central, Testerina and Docker / Kubernetes artifact generation during build.

### Given Ballerina is a programming language what about frameworks like Spring? Why should our Java developers learn another language?

Unlike Spring, Ballerina is both agile and integration simple. While general purpose programming languages make software development agile, developers must still take responsibility for the hard problems of integration by writing their own integration logic or using complex bolt-on frameworks like Spring. This approach is not integration simple.

In this sense, Ballerina is the language, the framework, the runtimes, the gateway, the circuit breaker, the message broker, and transaction coordinator all rolled into a single design and implementation.

Additionally, Pivotal imposes tough requirements for developers to get Spring support. They must purchase Pivotal Cloud Foundry to get Spring support. Additionally, Pivotal does not provide JVM support which must be sought from different vendors. And, the API Gateway, circuit breaker and other components are sourced from Netflix OSS projects and not supported as part of Spring.

### How does Ballerina compare to a Service Mesh like Istio?

Service meshes exist to make it easier to write resilient distributed systems. They apply transaction resilience at the network request level and Ballerina applies it within the logic level. Ballerina both works with and without a service mesh! In situations where a service mesh is not present, Ballerina provides network bridging and transaction management for invocations in between services written with Ballerina or integrated via the Ballerina Bridge. In situations where a service mesh already exists, Ballerina services can be configured to delegate routing and transaction capabilities to the underlying mesh.

### Will you accept my language change?

People often suggest improvements to the language - the developer mailing list contains a rich history of such discussions, but very few of these changes have been accepted.

Although Ballerina is an open source projects, the language and libraries are protected by a compatibility standard that prevents changes that break existing programs. If your proposal violates the Ballerina 1 specification we cannot entertain the idea, regardless of its merit. A future major release of Ballerina may be incompatible with Ballerina 1, but we’re not ready to start talking about that idea as we are still working towards long term stability of Ballerina 1!

Even if your proposal is compatible with Ballerina 1 specification, it might not be in the spirit of Ballerina’s design goals. The language designers are generous with their time in elaborating on the various design intentions to help provide deeper background on its history and direction.

### What is the roadmap for Ballerina?

Current implementation of Ballerina is based on Java. We want to make it the most efficient implementation. We have two possible paths to do that. One is to optimize the current design and implementation of runtime. The other is to re-write the language in native compiled language such as C++. The objective is to make the implementation of the runtime the most optimize and hence the most performing. For this we are considering and LLVM based implementation.
Once you have two or more implementations against the same language specification it is a must to have a language test suite to ensure compliance to specification. Hence a language test suite is on the roadmap plans.
We envision that we would build strong AI and ML capabilities into Ballerina. Similar to all design elements of the language that are designed ground up and embedded into the language by design, we want to make AI and ML part of the language.
Ballerina in its current form solves the integration problem end to end. However, it is not solving the application development aspect end to end. Once you have endpoints connected and integrated, you need to be able to build powerful applications utilizing those connected service architectures. As part of the Ballerina roadmap, we could take up the application development concerns into account and get the solution implementation models simplified.

### Does WSO2 use Ballerina internally?

Yes!

There are several Ballerina programs deployed in production inside WSO2. A public example is the server behind central.ballerina.io. It’s package management interfaces were built as Ballerina services and then deployed as containers on Google’s Kubernetes engine.

Other examples include the WSO2 Update Manager, which WSO2 customers use to access WSO2 software and  WSO2’s API Manager gateway component.

### Can I translate the Ballerina home page into another language?
Absolutely. We encourage developers to make Ballerina language sites in their own languages. You can issue pull requests and we’ll host the translated versions at ballerina.io.

### Will Testerina automatically generate service mocks?

Yes, it generates mocks when Swagger is present.

### Which Ballerina connectors will be available on May 1?

The best place to see the latest set of connectors is browsing Ballerina Central at central.ballerina.io, or by using `ballerina search` on the command line.

The Ballerina team and WSO2 are publishing a series of additional packages around Twitter, Gmail, Github, Salesforce.com, and others. You can browse the packages that WSO2 is publishing by viewing the http://github.com/wso2-ballerina organization. Each repository is an additional package we are shipping.

### What analytics and monitoring does Ballerina support?

For details, see the [How to Observe Ballerina Programs](/learn/how-to-observe-ballerina-code/) document.

### What are the secure coding guidelines?

For details, see the [How to Secure Ballerina Programs](/learn/how-to-write-secure-ballerina-code/) document on ballerina.io.

### How can we integrate legacy code (written on Java or other languages) with Ballerina?

Ballerina Bridge is a project within the Ballerina organization that provides a containerized sidecar that is able to bridge legacy services to work with Ballerina transactions. The sidecar connects to the legacy service over localhost and bridges the transaction initiated by a Ballerina service with the internal transaction semantics of the legacy service managed by the sidecar.

### What build tools should be used for large projects with Ballerina?

Ballerina ships with its own build system and package management.

### What are the recommendations on Continuous Integration / Continuous Delivery and Application Lifecycle Management for Ballerina? How do you track requirements to test results traceability with Ballerina? What DevOps tools are available for Ballerina?

Development teams should continue to use their favorite or existing lifecycle solutions. Ballerina works with all of them. Though we will note that because Ballerina is able to generate deployment artifacts during compilation and run its own unit tests, there are many phases of iterative development which can be done directly by Ballerina instead of using the traditional CI/CD.

### What are the best practices for versioning Ballerina based applications?

We require Ballerina packages to follow semver semantics. If you are creating a shared package that is pushed into a Ballerina registry, like Ballerina Central, every push requires a versioning increment. We do not allow updates to an existing version as this creates confusion and difficulties with downstream adopters.

### What are the guidelines for application governance with Ballerina?

Ballerina creates services with APIs. These services can be governed using your organizations best practices. We would encourage you to consider WSO2 API Manager as a leading governance and lifecycle product for APIs.

### What are the best practices for testing Ballerina based projects?

Ballerina ships with Testerina, a built-in mechanism for running unit tests against hosted services. For integration and system tests, Ballerina works with your existing lifecycle management solutions.

### How do you write testable and maintainable code with Ballerina?

For details, see the [How to Write Effective Ballerina Code]().

### Can we embed our legacy libraries with Ballerina?

Legacy libraries cannot be linked to a Ballerina program.

However, you can make your legacy libraries into microservices and then invoke them over the network The Ballerina Bridge enables legacy services to participate in transactions with other Ballerina services for this purpose.

### Will business designers be able to do graphical GUI development still? How can we keep the design to code alignment with Ballerina?

Yes, it is entirely possible for business designers to use Ballerina Composer to use graphical constructs to create Ballerina services.

Ballerina’s syntax is structured to represent the core constructs of integration. By designing the keywords and the language layout using integration semantics, it is possible for IDEs and the Ballerina Composer to provide a graphical representation of the code that is identical to a sequence or interaction diagram in UML. This diagram does not require intermediate formats or translation. The Ballerina Composer can be used to generate new code in your Ballerina files through drag and drop, provide a visualization to others that document how your code interacts with other endpoints, and to provide dev tracing flows of interactions during debugging.

### What forms of debugging does Ballerina support?

Ballerina has command-line debugger support which integrates into your favorite IDE. You can also perform graphical debugging within Ballerina Composer. Ballerina services have transaction tracing information collected which can be sent to product that provides runtime observability.

### Do you have any benchmarks that compare Ballerina with other languages?

We do not have any yet.

### What is the footprint?

The memory footprint depends on the use case and the load. A simple Ballerina service which simultaneously serves 500 concurrent users will have a low memory footprint of  50 MB. A ballerina main() program with simple logic (such as a loop counter) consumes 15  MB.

### What is the update process for Ballerina? What is the update frequency?

We will update Ballerina once / month with a community release. These releases will require a roll-forward support requirement. Ballerina will have levels of language backwards compatibility commitments so that adopters can depend upon stability. When WSO2 releases commercial support we will have a binary patch model that works against older versions of Ballerina.

### How do I report security vulnerabilities?

See http://ballerina.io/security.

### Can I write my MVC app with Ballerina?

Ballerina does not currently have an MVC framework. We’d love for the community to add one and publish on Ballerina Central. Ballerina’s object and struct model makes it easy to synchronize data and models.

### Is this more functional than object oriented?

Ballerina is a modern language that attempts to bring together productive features of functional, imperative, and object-oriented programming.

### Is Ballerina an object-oriented language?

Both `objects` (`types`) and `functions` are first class constructs in Ballerina. Developers have the flexibility to choose the most appropriate option depending on the requirement.

While Ballerina has `objects` it can technically be designated an OOP, however, development methodology is not predominantly OOP-based. The design principles are based on sequence diagramming concepts that include declarative elements that are not purely OOP.

### Why is there no type inheritance?

Ballerina is based on type equivalence, rather than type inheritance. The type system in Ballerina is based on set theory and, therefore, type equivalence has more meaning for this domain than type inheritance.

### Why does Ballerina not support overloading of methods and operators?

This is for simplicity purposes.

In Ballerina, functions can be defined with required parameters, defaultable parameters, and optional rest parameters. Ballerina supports calling defaultable parameters in any order by passing explicit `name=value` on invocation, and this approach cannot be combined with parameter overloading. We felt that this model offered package designers and developers more flexibility than overloading.

Ballerina also supports the use of function name as a function pointer. This makes it easy to understand code because there is a single function corresponding to a given function name and is more powerful than the use of function overloading.

For more information on the function pointer syntax, see the [Funtion Pointer example](/learn/by-example/function-pointers/).

### What compiler technology is used to build the compiler?

The Ballerina compiler is written in Java with a generated LL(*) parser using ANTLR4. It generates binary files containing a Ballerina bytecode format that is platform neutral and different than Java’s bytecode..

Ballerina compiler is a multi-pass compiler with stages for lexical and syntax analysis, semantic analysis, Code analysis, desugar (remove syntactic sugar), and code generation.

### How is the runtime support implemented?

Ballerina has a virtual machine (BVM that executes Ballerina byte code instructions. You can run both source files and compiled byte code files with BVM.

The runtime consists of an interpreter, a primitive type system, support for objects, methods and functions, and a parallel programming model based on workers. The capabilities are extended with a standard library, set of endpoints plus transports, and built-in models for documentation, testing, observability, secure coding, event streams and transactions.

### Why is my trivial service such a large binary?

The linker in the Ballerina toolchain creates statically-linked binaries by default. All Ballerina binaries therefore include the Ballerina runtime, along with the runtime type information to support type checks, panic-time stack traces, observability metrics.

A simple Ballerina 'hello, world' program compiled and linked statically is around 600 kB.

### What is the concurrency/threading model?

Ballerina's runtime implements a virtual machine that executes the Ballerina bytecode, which is called the BVM.

The BVM's execution model is made up of lightweight parallel execution units known as "workers". A worker is a lightweight parallel execution unit. Every function or network action defines one or more workers to execute its logic, and each has its own lifecycle consisting of worker states such as READY, RUNNING, and WAITING_FOR_RESPONSE.

A worker is not bound exclusively to a single operating system thread, but rather, it uses full non-blocking policy, where it will never block an executing thread if the worker is not actively using it. This is controlled by the scheduler in the BVM, which coordinates the worker executions with the physical threads. For example, I/O operations such as HTTP calls will release the physical threads and only after the I/O response is available will the worker resume.

This behavior gives a more natural programming environment for the developer, so she does not have to explicitly consider non-blocking I/O handling semantics. Also, this style of physical thread allocation is efficient and lowers the number of context switches optimizing CPU allocations.

### Would you provide NLP, ML toolkits around Ballerina?

We do not have any plans. The community can add their own packages through Ballerina Central, and we will work hard to delegate frameworks and projects to the community.

### Which enterprise patterns and microservices patterns does Ballerina support?

See the [Ballerina By Guide](/learn/by-guide/) to find out how to use Ballerina to do full lifecycle integration development. Many enterprise patterns are demonstrated with [Ballerina by Example](/learn/by-example/).
