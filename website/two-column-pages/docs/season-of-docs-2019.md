# Project Proposals for 2019

## Proposal 1: Using Envoy Proxy as a routing engine of the API Microgateway

### Description

WSO2 API Microgateway currenly uses Ballerina as the undrelying routing engine. This project is to embedd Envoy proxy as the routing engine for the API Microgateway. We will have to use the underlying authentication, authorization, rate-limiting and observability capabilities of Envoy to make it suitable enough to perform the needs of the Microgateway. A developer should be able to use an Open API Specification (Swagger) file and provided the endpoint of the target services, use the Microgateway tooling capabilities to configure the routing paths of the Envoy proxy. When configured properly, Envoy proxy should be able to validate, rate-limit and monitor (observability) the requests received on the relevant paths and route them to the target service.

### Deliverables

An enhanced version of the WSO2 API Microgateway which is capable of switching between Envoy and Ballerina for the routing of requests.

### Skills Needed

Java, Docker, YAML, some knowledge on OAuth2.0, some understanding of Microservices.

### References

[1] - [Working with the API Microgateway](https://docs.wso2.com/display/AM260/Working+with+the+API+Microgateway)

[2] - [https://www.envoyproxy.io/](https://www.envoyproxy.io/)

[3] - [https://github.com/wso2/product-microgateway](https://github.com/wso2/product-microgateway)

### Possible Mentor/s

Nuwan Dias, Sanjeewa Malalgoda, Pubudu Gunatilaka.

## Proposal 2: Building a graceful update model for the Microgateway

### Description

The WSO2 API Microgateway has an immutable runtime. Meaning that if an update is made to the interface or any other configuration the microgateway runtime needs to be rebuilt and redeployed. This is not a huge concern for Kubernetes like environments where the infrastructure itself handles this via rolling updates. However for traditional VM based infrastructures it is important to build a mechanism to support graceful updates. When this is implemented, we should have a model where a config/interface change can be deployed on the Microgateway with no downtime.

### Deliverables

A framework for gracefully updating the Microgateway

### Skills Needed

Java, Reliable Messaging (JMS), An understanding of Microservices

### References

[1] - [Working with the API Microgateway](https://docs.wso2.com/display/AM260/Working+with+the+API+Microgateway)

[2] - [https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)

### Possible Mentor/s

Nuwan Dias, Harsha Kumara, Bhathiya Jayasekara

## Proposal 3: Building APIs for Business Verticals on the WSO2 API Manager

### Description

Many popular business verticals now have API templates. Such as for Open Banking, Health Care, Telecommunication, etc. This project is about building a mechanism of selecting a few such business verticals and building the API templates of these APIs. This project also requires to build a mechanism where a process reads the template definitions from a given location and populates the API Management design time and run time with the APIs corresponding to the templates.

### Deliverables

An executable set of API templates for a few selected business verticals.

### Skills Needed

Java, REST, HTTP, templating

### References

[1] - [https://wso2.com/solutions/financial/open-banking/](https://wso2.com/solutions/financial/open-banking/)

[2] - [https://www.programmableweb.com/category/healthcare/api](https://www.programmableweb.com/category/healthcare/api)

[3] - [https://api.data.gov/](https://api.data.gov/)

### Possible Mentor/s

Nuwan Dias, Thilini Shanika, Kasun Tennakoon.

## Proposal 4: Prometheus metrics summary based alerting and API microgateway pod autoscaling

### Description

WSO2 API Manager has alerting capabilities based on the WSO2 API Analytics. There are different alert types such as abnormal response time, abnormal backend time, abnormal request counts, abnormal resource access pattern, etc. These alerts are already supported and added in API Manager Analytics. This project is about integration Prometheus with WSO2 API Manager and does the alerting using the Prometheus metric summary for alert types available in WSO2 API Manager. In addition to that, based on the Prometheus metric summary, Kubernetes pods have to autoscale. This can be done by writing policies in Kubernetes for API Microgateway.

### Deliverables

Prometheus alerting based artifacts, Autoscaling policies for pod autoscaling based on Prometheus

### Skills Needed

Kubernetes, Docker, Prometheus

### References

[1] - [https://docs.wso2.com/display/AM260/Configuring+APIM+Analytics](https://docs.wso2.com/display/AM260/Configuring+APIM+Analytics)

[2] - [https://docs.wso2.com/display/AM260/Alert+Types](https://docs.wso2.com/display/AM260/Alert+Types)

[3] - [https://prometheus.io/](https://prometheus.io/)

[4] - [https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

### Possible Mentor/s

Nuwan Dias, Pubudu Gunatilaka, Fazlan Nazeem.

## Proposal 5: Revamping the WSO2 API Manager admin web app**

### Description

WSO2 API Manager Admin application is used to facilitate the administrative tasks in the API Management duties.The existing API Manager Admin portal has developed using JaggeryJS technology. For the next generation of the API Manager product(Version 3.0), We have been working on a new admin portal application with single page application architecture using React JS framework. This React based web app is still in the development stage and you could find the source code of the app in here[2].

The object of this project is to improve the API Manager admin portal written using React framework to have all the existing feature in the JaggeryJS based admin portal application.

### Deliverables

Fully fledged Admin portal application(Single Page) with the features in existing jaggery app.

### Skills Needed

JavaScript, ReactJS, Java with some knowledge on OAuth2.0 and some understanding of Microservices.

### References

[1] - [https://docs.wso2.com/display/AM260/apidocs/admin/](https://docs.wso2.com/display/AM260/apidocs/admin/)

[2] - [https://github.com/wso2/carbon-apimgt/tree/master/features/apimgt/org.wso2.carbon.apimgt.admin.feature/src/main/resources/admin](https://github.com/wso2/carbon-apimgt/tree/master/features/apimgt/org.wso2.carbon.apimgt.admin.feature/src/main/resources/admin)

[3] - [https://docs.wso2.com/display/AM300/WSO2+API+Manager+Documentation](https://docs.wso2.com/display/AM300/WSO2+API+Manager+Documentation)

[4] - [https://medium.com/@tmkasun/wso2-api-manager-new-look-27a186bc83d5](https://medium.com/@tmkasun/wso2-api-manager-new-look-27a186bc83d5)

### Possible Mentor/s

Nuwan Dias, Chanaka Jayasena, Kasun Thennakoon

## Proposal 6: Implement UI test for ReactJS based web apps

### Description

The current Reactjs based web applications have low test coverage for the React components and other JS modules.So that, The objective of this project is to improve the test coverage of the web applications and setup to run unit and integration tests in the build process. The student will have the freedom to come up with the best approach to implement the unit and integration test for React based web applications.

### Deliverables

Introduce a test framework to the web applications and setup to run the test during the web app build process.

### Skills Needed

JavaScript, ReactJS, Jest, with some knowledge on OAuth2.0.

### References

[1] - [https://github.com/wso2/product-apim/issues/3892](https://github.com/wso2/product-apim/issues/3892)

[2] - [https://docs.wso2.com/display/AM300/WSO2+API+Manager+Documentation](https://docs.wso2.com/display/AM300/WSO2+API+Manager+Documentation)

[3] - [https://medium.com/@tmkasun/wso2-api-manager-new-look-27a186bc83d5](https://medium.com/@tmkasun/wso2-api-manager-new-look-27a186bc83d5)

### Possible Mentor/s

Nuwan Dias, Chanaka Jayasena, Thilini Shanika

## Proposal 7: Visual Studio Code Plugin for Siddhi

### Description

Build a Visual Studio Code Plugin[1] for Siddhi[2] with syntax highlighting, code completion, error reporting.  Siddhi is the complex event processing library we use within WSO2 SP[3]. Siddhi is a SQL like language where you can write queries which can do real-time analysis. You can get yourself familiar with Siddhi language through Siddhi samples[4] and test-cases[5]. Siddhi is based on antlr[6] and grammar file can be found here[7].

### Deliverables

- Visual Studio Code Plugin with syntax highlighting, code completion and error reporting

### Skills Needed

- Visual Studio Code Plugin development

### References

[1] [https://code.visualstudio.com/api](https://code.visualstudio.com/api)

[2] [https://github.com/wso2/siddhi](https://github.com/wso2/siddhi)

[3] [https://wso2.com/analytics-and-stream-processing/](https://wso2.com/analytics-and-stream-processing/)

[4] [https://github.com/wso2/siddhi/tree/master/modules/siddhi-samples/quick-start-samples](https://github.com/wso2/siddhi/tree/master/modules/siddhi-samples/quick-start-samples)

[5] [https://github.com/wso2/siddhi/tree/master/modules/siddhi-core/src/main/java/org/wso2/siddhi/core/query](https://github.com/wso2/siddhi/tree/master/modules/siddhi-core/src/main/java/org/wso2/siddhi/core/query)

[6] [http://www.antlr.org/](http://www.antlr.org/)

[7] [https://github.com/wso2/siddhi/blob/master/modules/siddhi-query-compiler/src/main/antlr4/org/wso2/siddhi/query/compiler/SiddhiQL.g4](https://github.com/wso2/siddhi/blob/master/modules/siddhi-query-compiler/src/main/antlr4/org/wso2/siddhi/query/compiler/SiddhiQL.g4)

### Possible Mentor/s

Mohan, Suho, NipunaC and Rasika



## Proposal 8: Enabling FIDO2 Authentication in WSO2 Identity Server

### Description

FIDO protocols use the standard public key cryptography techniques to provide stronger passwordless authentication. FIDO2 is an evolution of the U2F open authentication standard which consists of the W3C Web Authentication specification, WebAuthn API (Application Programming Interface), and the Client to Authentication Protocol (CTAP).[1]

WSO2 Identity Server supports FIDO U2F in Multi-factor authentication[2]. The scope of this project is to implement the FIDO2 authentication support in WSO2 IS

### Deliverables

- FIDO2 Authenticator
- Articles
- Documentation

### Skills Needed

- Java

### References

[1] [https://fidoalliance.org/fido2/](https://fidoalliance.org/fido2/)

[2] [https://docs.wso2.com/display/IS510/Multi-factor+Authentication+using+FIDO](https://docs.wso2.com/display/IS510/Multi-factor+Authentication+using+FIDO)

[3] [https://github.com/wso2/product-is/issues/3579](https://github.com/wso2/product-is/issues/3579)

### Possible Mentor/s

Pamoda Wimalasiri, Omindu Rathnaweera, Ishara Karunarathna

## Proposal 9: Capacity Planning Prediction Tool for Enterprise Integrator

### Description

EI resource utilization in a given production environment depends on many factors. Special days in a year and seasonal variations affect the resource utilization of a EI deployment. Under estimation of capacity causes the unavailability while over estimation causes infrastructure cost.

This project is about developing an external system that can predict the EI capacity based on,

- Historical capacity utilization
- Seasonal variations
- Trends
- Sentiment of the public

### Deliverables

- Implementation of an system which can predict and help capacity planning
- Documentation

### Skills Needed

- Knowledge in machine learning and AI
- Familiarity of Python and Tensorflow etc. are useful but not a must
- Previous experience in machine learning projects are useful

### Possible Mentor/s

Maninda Edirisooriya (maninda@wso2.com)

## Proposal 10: OIDC Federated Logout for WSO2 Identity Server

### Description

OpenID Connect (OIDC) [1] is a standard authentication protocol which is widely used by modern applications. Its based on the OAuth 2.0 and it defines three logout mechanisms [2][3][4].

WSO2 Identity Server (WSO2 IS) [5] is an open source Identity and Access Management product. WSO2 IS supports identity federation [6] which allows client applications to login through the external (secondary) identity server. As per WSO2 IS architecture [7], communication with the external identity provider handled by the outbound authentication connectors and WSO2 IS has the support of several outbound authentication connectors including  SAML 2.0, OIDC, PassiveSTS as well as many social connectors.

With this project, it&#39;s expected to improve the OIDC connector [8] to introduce logout capability by implementing one of standard logout mechanisms defined in OIDC specifications.  Implementation will require candidate to get familiar with selected logout specification and implement it to existing WSO2 IS code base. If time permits, other logout mechanisms too can be investigated.

### Deliverables

- Implementation of OIDC federation logout
- Automation tests
- Documentation

### Skills Needed

- Skill to read, understand and translate specifications it to working code
- Java, Maven, Git

### References

[1] [https://openid.net/specs/openid-connect-core-1\_0.html](https://openid.net/specs/openid-connect-core-1_0.html)

[2] [https://openid.net/specs/openid-connect-session-1\_0.html](https://openid.net/specs/openid-connect-session-1_0.html)

[3] [https://openid.net/specs/openid-connect-backchannel-1\_0.html](https://openid.net/specs/openid-connect-backchannel-1_0.html)

[4] [https://openid.net/specs/openid-connect-frontchannel-1\_0.html](https://openid.net/specs/openid-connect-frontchannel-1_0.html)

[5] [https://wso2.com/identity-and-access-management/](https://wso2.com/identity-and-access-management/)

[6] [https://docs.wso2.com/display/IS570/Identity+Federation](https://docs.wso2.com/display/IS570/Identity+Federation)

[7] [https://docs.wso2.com/display/IS570/Architecture](https://docs.wso2.com/display/IS570/Architecture)

[8] [https://github.com/wso2-extensions/identity-outbound-auth-oidc](https://github.com/wso2-extensions/identity-outbound-auth-oidc)

### Possible Mentor/s

Kavindu Dodanduwa, Piraveena Paralogarajah, Darshana Gunawardana

## Proposal 11: WSO2 IS Integration with an Opensource IoT Server

### Description

The idea of this project is to build a real-world IoT device integrated with WSO2 IS for delegated access control using OAuth2. We expect the participant to decide on a problem to be solved with an IoT solution and choose an open source IoT server or framework to build the device. The participant should decide on the way to integrate WSO2 IS with the chosen IoT server and implement the missing parts to complete the integration if required (new APIs, custom modules or extensions).

### Deliverables

- Select an open source third party IoT Server or Framework (excluding WSO2 IoT Server)
- Get/Build some real IoT device, have APIs to do real work (eg: turn a light on/off)
- Delegate access with WSO2 IS (OAuth2)
- Documentation
- Demo
- Articles

### Skills Needed

- IoT
- Knowledge of delegated access control (OAuth 2)
- REST API
- Understanding product specifications and applying to solve a real-world problem
- Additional skills depending on the Chosen IoT server and the problem to be solved

### References

[1] [https://docs.wso2.com/display/IS570/Delegated+Access+Control](https://docs.wso2.com/display/IS570/Delegated+Access+Control)

[2] [https://tools.ietf.org/html/rfc6749](https://tools.ietf.org/html/rfc6749)

### Possible Mentor/s

Abilashini Thiyagarajah, Ishara Ilangasinghe, Thanuja Jayasinghe

## Proposal 12: Anomaly detection for WSO2 IS with an Open source ML/Analytic server

### Description

Login, Logout, Token Request, Refresh or any activity data which are generated based on WSO2 IS needs to be fed into an analytics engine. The analytics engine can be selected or can be written from ground up. The analytics engine needs to support microservice architecture.

Implementation can use Markov-Chain, Time-Series analysis, Multi Domain Segmentation or any other model(s) suitable for the purpose.

The system should return a probability (0 to 1) if queries the engine with {User, Activity, Time, and activity data}

The adaptive authentication in WSO2 IS may use this probability to evaluate the current login request whether it needs to be presented to 2nd or 3rd factor.

Token validation in WSO2 IS may use this result while validating or refreshing tokens.

### Deliverables

- User behavior analysis engine (or scripts to be installed to selected analytics server)
- Script to simulate some user behavior, repeated.
- Documentation

### Skills Needed

- Analytics/Data Science
- Basic knowledge on authentication and OAuth 2.0

### References

[1] [https://docs.wso2.com/display/IS570/WSO2+Identity+Server+Documentation](https://docs.wso2.com/display/IS570/WSO2+Identity+Server+Documentation)

[2] [https://docs.wso2.com/display/IS570/Analytics](https://docs.wso2.com/display/IS570/Analytics)

### Possible Mentor/s

Ashen Weerathunga, Dilin Dampahalage, Tharindu Bandara

## Proposal 13: Adaptive Authentication Flow Design UI

### Description

WSO2 Identity Server uses JS like scripts to define the adaptive authentication flow. The purpose of this project is to develop a UI based tool where Identity Admins can design the authentication flow by using drag and drop components and providing any required parameters. That will help the Identity admins to define the authentication flow with little or no prior scripting syntax knowledge. And it will also help to present, and understand the flow easily.

The tool at the background should generate or modify the authentication script which is currently used and should do vice versa and update UI based flow if the script is updated directly.

### Deliverables

- UI based tool as mentioned in the description
- Documentation

### Skills Needed

- JS
- UI frameworks
- Java (Optional)

### References

[1] [https://docs.wso2.com/display/IS570/Adaptive+Authentication](https://docs.wso2.com/display/IS570/Adaptive+Authentication)

### Possible Mentor/s

Senthalan Kanagalingam, Pulasthi Mahawithana

## Proposal 14: Biometric Authenticator to integrate with mobile devices

### Description

Authenticator to authenticate users using existing biometric hardware(fingerprint, iris) in Mobile devices.

### Deliverables

- Mobile integrable biometric authenticator
- Unit/Integration tests
- A mobile application with an integrated biometric authenticator
- Documentation
- Article

### Skills Needed

- Java
- Knowledge in mobile application development

### References

[1] - [https://docs.wso2.com/display/IS570/Writing+a+Custom+Local+Authenticator](https://docs.wso2.com/display/IS570/Writing+a+Custom+Local+Authenticator)

### Possible Mentor/s

Janak Amarasena, Pulasthi Mahawithana

## Proposal 15: Support for OIDC Client Initiated Backchannel Authentication Flow

### Description

OpenID Connect Client Initiated Backchannel Authentication Flow is an authentication flow like OpenID Connect. However, unlike OpenID Connect, there is direct Relying Party to OpenID Provider communication without redirects through the user&#39;s browser. This specification allows a Relying Party that knows the user&#39;s identifier to obtain tokens from the OpenID Provider. The user consent is given at the user&#39;s Authentication Device mediated by the OpenID Provider.

### Deliverables

- WSO2 IS compliance for CIBA Specification
- Unit/Integration Tests
- Sample application to demonstrate the flow
- Documentation
- Article/Blogs/Screencasts

### Skills Needed

- Java

### References

[1] - [https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1\_0-02.html](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0-02.html)

### Possible Mentor/s

Farasath Ahamed, Janak Amarasena, Raveen Athapaththu

## Proposal 16: Ballerina Eclipse Plugin

### Description

Ballerina is a compiled, transactional, statically and strongly typed programming language with textual and graphical syntaxes. The objective of this project is to develop a plugin which can provide the support for Ballerina language in Eclipse. This plugin should be able to use the functionalities already provided by the Ballerina Language Server. Additionally to that, the plugin should also provide a diagram viewer where the plugin users can view the corresponding sequence diagram of the Ballerina codes.

This plugin should provide support for -

- Syntax highlighting
- Code formatting
- Code completion
- Go to definition
- Quick documentation
- Run / Debug
- Semantic analyzing
- Diagram view

### Deliverables

Feature complete plugin distribution which can be installed on Eclipse and can be used by Ballerina developers.

### Skills Needed

Java, Eclipse plugin development knowledge, Familiarity with Language Servers.

### References

[1] - [https://www.eclipse.org/articles/Article-Your%20First%20Plug-in/YourFirstPlugin.html](https://www.eclipse.org/articles/Article-Your%20First%20Plug-in/YourFirstPlugin.html)

[2] - [http://www.vogella.com/tutorials/EclipsePlugin/article.html#what-are-run-configurations](http://www.vogella.com/tutorials/EclipsePlugin/article.html#what-are-run-configurations)

[3] - [https://www.codeproject.com/Tips/893547/How-to-Create-Your-Own-Eclipse-IDE-Plug-in](https://www.codeproject.com/Tips/893547/How-to-Create-Your-Own-Eclipse-IDE-Plug-in)

[4] - [https://langserver.org](https://langserver.org/)

[5] - [https://microsoft.github.io/language-server-protocol/specification](https://microsoft.github.io/language-server-protocol/specification)

[6] - [https://github.com/ballerina-attic/plugin-eclipse](https://github.com/ballerina-attic/plugin-eclipse)

### Possible Mentor/s

Joseph Fonseka, Nadeeshan Gunasinghe, Kavith Lokuhewage, Shan Mahanama.

## Proposal 17: Write a BSON Encoder and a Decoder for Ballerina

### Description

MongoDB represents JSON documents in a format called BSON behind the scenes. BSON is a binary format in which zero or more ordered key/value pairs are stored as a single entity. We call this entity a document. BSON specification can be found at[1].

The purpose of this project is, to write a library to support conversion between Ballerina JSON and BSON. If time permits, using this library, a MongoDB driver can be written for Ballerina by implementing the MongoDB wire protocol[2].

### Deliverables

- Ballerina JSON to BSON encoder
- BSON into Ballerina JSON decoder
- Unit/Integration tests
- Documentation

### Skills Needed

Familiarity with JSON, Understanding of conversion between different data representations[3], Familiarity with Ballerina[4]

### References

[1] [http://bsonspec.org/spec.html](http://bsonspec.org/spec.html)

[2] [https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/#wp-message-header](https://docs.mongodb.com/manual/reference/mongodb-wire-protocol/#wp-message-header)

[3] [http://csfieldguide.org.nz/en/chapters/data-representation.html](http://csfieldguide.org.nz/en/chapters/data-representation.html)

[4] [https://ballerina.io](https://ballerina.io/)

### Possible Mentor/s

ManuriPerera(manurip@wso2.com), Rajith Vitharana(rajithv@wso2.com), Anupama Pathirage(anupama@wso2.com)

## Proposal 18: Redis Caching support for Enterprise Integrator

### Description

Redis is an open source, in-memory data structure store used as a database, a cache and a  message broker.

This project is about implementing a way that WSO2 EI can leverage Redis as the caching layer to cache the responses.

### Deliverables

- Implementation of Redis cache for EI
- Documentation
- Unit/Integration tests

### Skills Needed

Knowledge of WSO2 EI Fundamentals, Redis basics, Caching techniques

### References

[1] [https://docs.wso2.com/display/EI640/Cache+Mediator](https://docs.wso2.com/display/EI640/Cache+Mediator)

[2] [https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation](https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation)

[3] [https://redis.io/](https://redis.io/)

### Possible Mentor/s

Asanka Abeyweera (asankaab@[wso2.com](http://wso2.com/))

Isuru Udana (isuruu@[wso2.com](http://wso2.com/))

## Proposal 19: Data Connector for Enterprise Integrator

### Description

Currently WSO2 EI has the DBLookup Mediator and the DBReport Mediator to execute database queries. But those mediators have some functional limitations. For an example DBLookup Mediator returns only the first row of the result set. Therefore the recommendation is to use **Data services** to perform the query and call that from the ESB layer. But the idea is to eliminate the service call and use a data service mediator to perform database related queries.

This project is about developing a new mediator or a connector to do a database query in the mediation layer itself.

### Deliverables

- Implementation of Data connector
- Unit/ Integration tests
- Documentation

### Skills Needed

Basic knowledge related to databases, Knowledge in ESB and custom mediators are useful

### References

[1] [https://docs.wso2.com/display/EI640/Data+Service+Tutorials](https://docs.wso2.com/display/EI640/Data+Service+Tutorials)

[2] [https://docs.wso2.com/display/EI640/Working+with+Data+Services](https://docs.wso2.com/display/EI640/Working+with+Data+Services)

[3] [https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation](https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation)

[[4] ](https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation)[https://docs.wso2.com/display/EI640/Creating+Custom+Mediators](https://docs.wso2.com/display/EI640/Creating+Custom+Mediators)

[5] [https://docs.wso2.com/display/ESBCONNECTORS/Writing+a+Connector](https://docs.wso2.com/display/ESBCONNECTORS/Writing+a+Connector)

### Possible Mentor/s

Chanika Geeganage (chanika@wso2.com)

Isuru Udana (isuruu@wso2.com)

## Proposal 20:gRPCsupport for Enterprise Integrator

### Description

gRPC is an inter-process communication protocol which is implemented on top of HTTP2. gRPC can use protocol buffers as both its Interface Definition Language (IDL) and as its underlying message interchange format.

This projects includes adding gRPC support for WSO2 EI to expose gRPC services as well as invoke gRPC services.

### Deliverables

- Implementation of gRPC transport/inbound endpoint
- Documentation
- Unit/Integration tests

### Skills Needed

Fundamentals of gRPC and Protocol Buffers, Knowledge in WSO2 EI Fundamentals

### References

[1] [https://grpc.io/](https://grpc.io/)

[2] [https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation](https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation)

[[3] ](https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation)[https://docs.wso2.com/display/EI640/Custom+Inbound+Endpoint](https://docs.wso2.com/display/EI640/Custom+Inbound+Endpoint)

[4] [https://docs.wso2.com/display/EI640/ESB+Transports](https://docs.wso2.com/display/EI640/ESB+Transports)

### Possible Mentor/s

Kasun Indrasiri (kasun@wso2.com)

## Proposal 21: GraphQL Integration for Enterprise Integrator

### Description

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

This project is about designing and implement a mechanism to expose and consume GraphQL based APIs from EI.

### Deliverables

- Implementation of GraphQL API support for EI
- Documentation
- Unit/Integration tests

### Skills Needed

Basic understanding of GraphQL technology, Knowledge of WSO2 EI Fundamentals

### References

[1] [https://graphql.org/](https://graphql.org/)

[2] [https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation](https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation)

### Possible Mentor/s

Kasun Indrasiri (kasun@[wso2.com](http://wso2.com/))

## Proposal 22: Endpoint Resiliency with Hystrix for Enterprise Integrator

### Description

The resilient invocation of external services is implemented at the endpoint parameters that we configure. The resiliency capabilities can be vastly improved if we can integrate endpoint timeout, retry and circuit-breaking implementation with Hystrix.

### Deliverables

- Design docs on the possible ways that we integrate with Hystrix.
- Implementation of Hystrix Integration.
- Documentation
- Unit/Integration tests

### Skills Needed

Basic understanding on resiliency patterns and WSO2 EI endpoint management.

### References

[1] [https://github.com/Netflix/Hystrix](https://github.com/Netflix/Hystrix)

[2] [https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation](https://docs.wso2.com/display/EI640/WSO2+Enterprise+Integrator+Documentation)

### Possible Mentor/s

Isuru Udana (isuruu@[wso2.com](http://wso2.com/))

Kasun Indrasiri (kasun@[wso2.com](http://wso2.com/))

## Proposal 23: Providerealtimeaccess to TestGriddeploymentsviadashboard

### Description

TestGrid is a CI/CD test engine which tests entire feature-set of WSO2 products against a wide-array of supported infrastructure combinations based on the 3 steps below;

- Provision infrastructures — via Infrastructure-as-Code or plain shell scripts

- Create product deployments — via puppet or just plain shell scripts on top of the infrastructure

- Execute tests — execute different types of tests such as integration, performance, long running, and Chaos tests.

At the moment, the users do not have direct access to the deployments and only the pre-planned outputs of a deployment (logs, dumps, etc.) will be provided, and that is also when the test executions are completed.

With this project, weexpecttoproviderealtimeaccesstodeploymentsviaTestGriddashboard (e.g: A user can execute a shell command in an instance(node) of the deployment and receive the result.)

### Deliverables

- Implementation of the feature (Deployment access provider)
- Demo
- Documentation
- Unit/Integration tests

### Skills Needed

ReactJS, Java, Maven, Git,

### References

[1] [https://github.com/wso2/testgrid](https://github.com/wso2/testgrid)

[2] [https://medium.com/@kasunbg/how-wso2-verify-its-product-updates-9faa5e1b8d2](https://medium.com/@kasunbg/how-wso2-verify-its-product-updates-9faa5e1b8d2)[0](https://medium.com/@kasunbg/introducing-wso2-testgrid-89089fe9efb0)

### Possible Mentor/s

Kasun Gajasinghe (kasung@[wso2.com](http://wso2.com/)), Pasindu Jayaweera (pasinduj@wso2.com)

## Proposal 24: gRPC connector for Siddhi

### Description

gRPC [1] is a modern, open source remote procedure call (RPC) framework that can run anywhere. It enables client and server applications to communicate transparently, and makes it easier to build connected systems. Siddhi [2] is the complex event processing library we use within WSO2 SP[3]. Siddhi is a SQL like language where you can write queries which can do real-time analysis. Siddhi engine contains numerous types of connectors which allow to connect with different event sources and sinks to consume and publish events. In this project, you are expected to build a Siddhi IO connector to both consume and publish events to source and sink.

### Deliverables

- Implementation of the feature (IO connector: Source and Sink for Siddhi)
- Demo
- Documentation
- Unit/Integration tests

### Skills Needed

gRPC, Siddhi, Java, Maven

### References

[1] [https://grpc.io/](https://grpc.io/)

[2] [https://wso2.github.io/siddhi/](https://wso2.github.io/siddhi/)

[3] [https://docs.wso2.com/display/SP430](https://docs.wso2.com/display/SP430)

### Possible Mentor/s

Tishan (tishan@wso2.com), Danesh (danesh@wso2.com), Mohan (mohan@wso2.com), Suho (suho@wso2.com)

## Proposal 25: Atom plugin for Siddhi

### Description

Build an Atom Plugin[1] for Siddhi[2] with syntax highlighting, code completion, error reporting.  Siddhi is the complex event processing library we use within WSO2 SP[3]. Siddhi is a SQL like language where you can write queries which can do real-time analysis. You can get yourself familiar with Siddhi language through Siddhi samples[4] and test-cases[5]. Siddhi is based on antlr[6] and grammar file can be found here[7].

### Deliverables

- Implementation of the feature (Atom plugin to with syntax highlighting, code completion and error reporting)
- Demo
- Documentation
- Unit/Integration tests

### Skills Needed

Atom plugin development, Siddhi, Javascript