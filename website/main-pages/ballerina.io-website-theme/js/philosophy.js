$(document).ready(function () {

	var example_data = {
		"Integration Introduction Examples":[
			{"name": "Hello World Service", "url": "hello-world-service"},
			{"name": "JSON transformation", "url": "transform-json"},
			{"name": "JSON to XML Conversion", "url": "json-to-xml-conversion"},
			{"name": "Circuit Breaker", "url": "http-circuit-breaker"},
			{"name": "Load Balancing", "url": "http-load-balancer"},
			{"name": "Failover", "url": "http-failover"},
			{"name": "Tables and SQL", "url": "sql-queries-on-tables"}],

		"Integration Reference":[
			{"name": "Content-based Routing", "url": "content-based-routing"},
			{"name": "Websockets", "url": "websocket-basic-sample"},
			{"name": "Distributed Transactions", "url": "distributed-transactions"}],

		"HTTP/HTTPS":[
			{"name": "Sessions", "url": "http-sessions"},
			{"name": "Client Connector", "url": "http-client-connector"},
			{"name": "Redirects", "url": "http-redirects"},
			{"name": "Base and Path", "url": "base-path-and-path"},
			{"name": "Query Path Matrix Param", "url": "query-path-matrix-param"},
			{"name": "Produces/Consumes", "url": "produces-consumes"},
			{"name": "Header Based Routing", "url": "header-based-routing"},
			{"name": "Server-Client", "url": "https-server-client-connectors"},
			{"name": "Passthrough", "url": "passthrough"},
			{"name": "Mutual SSL", "url": "mutual-ssl"},
			{"name": "Filter Connector", "url": "filter-connector"},
			{"name": "HTTPS Server Connector", "url": "https-server-connector"},
			{"name": "HTTP Disable Chunking", "url": "http-disable-chunking"},
			{"name": "HTTP Trace Logs", "url": "http-trace-logs"},
			{"name": "HTTP to WebSocket Upgrade", "url": "http-to-websocket-upgrade"}],

		"WebSockets":[
			{"name": "WebSocket Chat Application", "url": "websocket-chat-application"},
			{"name": "WebSocket Proxy Server", "url": "websocket-proxy-server"}],

		"JMS":[
			{"name": "JMS Durable Topic Message Subscriber", "url": "jms-durable-topic-message-subscriber"},
			{"name": "JMS Queue Message Producer Transactional", "url": "jms-queue-message-producer-transactional"},
			{"name": "JMS Queue Message Producer", "url": "jms-queue-message-producer"},
			{"name": "JMS Queue Message Receiver Sync Client Ack", "url": "jms-queue-message-receiver-sync-client-ack"},
			{"name": "JMS Queue Message Receiver Sync", "url": "jms-queue-message-receiver-sync"},
			{"name": "JMS Queue Message Receiver with Client Acknowledgment", "url": "jms-queue-message-receiver-with-client-acknowledgment"},
			{"name": "JMS Queue Message Receiver", "url": "jms-queue-message-receiver"},
			{"name": "JMS Simple Durable Topic Message Subscriber", "url": "jms-simple-durable-topic-message-subscriber"},
			{"name": "JMS Simple Queue Message Producer", "url": "jms-simple-queue-message-producer"},
			{"name": "JMS Simple Queue Message Receiver", "url": "jms-simple-queue-message-receiver"},
			{"name": "JMS Simple Topic Message Producer", "url": "jms-simple-topic-message-producer"},
			{"name": "JMS Simple Topic Message Subscriber", "url": "jms-simple-topic-message-subscriber"},
			{"name": "JMS Topic Message Producer", "url": "jms-topic-message-producer"},
			{"name": "JMS Topic Message Subscriber", "url": "jms-topic-message-subscriber"}],


		"gRPC":[
			{"name": "gRPC Bidirectional Streaming", "url": "grpc-bidirectional-streaming"},
			{"name": "gRPC Client Streaming", "url": "grpc-client-streaming"},
			{"name": "gRPC Secured Unary", "url": "grpc-secured-unary"},
			{"name": "gRPC Server Streaming", "url": "grpc-server-streaming"},
			{"name": "gRPC Unary Blocking", "url": "grpc-unary-blocking"},
			{"name": "gRPC Unary Non Blocking", "url": "grpc-unary-non-blocking"}],

		"Core Language Examples":[
			{"name": "Hello World - Main", "url": "hello-world"},
			{"name": "Functions", "url": "functions"},
			{"name": "Async", "url": "async"}],

		"Language Reference":[
			{"name": "Hello World Parallel", "url": "hello-world-parallel"},
			{"name": "If Else", "url": "if-else"},
			{"name": "While", "url": "while"},
			{"name": "Transactions", "url": "transactions"},
			{"name": "Errors", "url": "errors"},
			{"name": "Throw", "url": "throw"},
			{"name": "Try/Catch/Finally", "url": "try-catch-finally"},
			{"name": "Fork/Join", "url": "fork-join"},
			{"name": "Worker", "url": "worker"},
			{"name": "Worker Interaction", "url": "worker-interaction"},
			{"name": "Function Pointers", "url": "function-pointers"},
			{"name": "Lambda", "url": "lambda"},
			{"name": "Transformer", "url": "transformers"},
			{"name": "For Each", "url": "foreach"},
			{"name": "Fork Join Condition Some", "url": "fork-join-condition-some"},
			{"name": "Fork Join Variable Access", "url": "fork-join-variable-access"}],

		"Deployment Basics":[
			{"name": "Tracing", "url": "observe-tracing"}],

		"Type Reference":[
			{"name": "Value Types", "url": "value-types"},
			{"name": "Strings", "url": "strings"},
			{"name": "String Template", "url": "string-template"},
			{"name": "Blob Type", "url": "blob-type"},
			{"name": "Maps", "url": "maps"},
			{"name": "XML", "url": "xml"},
			{"name": "XML Namespaces", "url": "xml-namespaces"},
			{"name": "JSON", "url": "json"},
			{"name": "JSON Literals", "url": "json-literals"},
			{"name": "JSON Struct/Map Conversion", "url": "json-struct-map-conversion"},
			{"name": "Constrained JSON", "url": "constrained-json"},
			{"name": "XML to JSON Conversion", "url": "xml-to-json-conversion"},
			{"name": "Any Type", "url": "any-type"},
			{"name": "Var", "url": "var"},
			{"name": "Identifier Literals", "url": "identifier-literals"},
			{"name": "Constants", "url": "constants"},
			{"name": "Global Variables", "url": "global-variables"},
			{"name": "Arrays", "url": "arrays"},
			{"name": "Array of Arrays", "url": "array-of-arrays"},
			{"name": "Structs", "url": "structs"},
			{"name": "Lengthof", "url": "lengthof"},
			{"name": "Type Casting", "url": "type-casting"},
			{"name": "Type Conversion", "url": "type-conversion"},
			{"name": "Ternary Operators", "url": "ternary"}],

		"Unit Testing":[
			{"name": "Testerina Assertions", "url": "testerina-assertions"},
			{"name": "Testerina Before After Suite", "url": "testerina-before-after-suite"},
			{"name": "Testerina Before After", "url": "testerina-before-after"},
			{"name": "Testerina Before Each", "url": "testerina-before-each"},
			{"name": "Testerina Data Provider", "url": "testerina-data-provider"},
			{"name": "Testerina Depends On", "url": "testerina-depends-on"},
			{"name": "Testerina Function Mocks", "url": "testerina-function-mocks"},
			{"name": "Testerina Groups", "url": "testerina-groups"}],

		"Standard Library":[
			{"name": "Date Time", "url": "date-time"},
			{"name": "Caching", "url": "caching"},
			{"name": "Config API", "url": "config-api"},
			{"name": "File API", "url": "file-api"},
			{"name": "Byte I/O", "url": "byte-i-o"},
			{"name": "Character I/O", "url": "character-i-o"},
			{"name": "Record I/O", "url": "record-i-o"},
			{"name": "Log API", "url": "log-api"},
			{"name": "Math", "url": "math-functions"},
			{"name": "SQL", "url": "sql-queries-on-tables"},
			{"name": "Task Timer", "url": "task-timer"},
			{"name": "Task Appointment", "url": "task-appointment"}],

		"Security":[
			{"name": "Taint Checking", "url": "taint-checking"}],

		"Data Management":[
			{"name": "SQL Client connector", "url": "sql-connector"}],

		"Streams":[
			{"name": "Streams", "url": "streams"},
			{"name": "Streams within Services", "url": "streams-within-services"},
			{"name": "Streams Sequences", "url": "streams-sequences"},
			{"name": "Streams Patterns", "url": "streams-patterns"},
			{"name": "Streams Join", "url": "streams-join"}],
	};

	var i = 0;
	var div_content;
	$.each(example_data, function (key, value) {
			//get title
			div_content = "";

			div_content += '<ul>';
			div_content += '<li class="cTableTitle">' + key + '</li>';

			$.each(value, function (exkey, example) {
					var link = example.replace(/ /g, "-");
					link = link.replace(/\//g, "-").toLowerCase();
					div_content += '<li><a href="/learn/by-example/' + link + '.html">' + example + '</a></li>';
			});

			div_content += '</ul>';

			var row_id = i % 4;
			$(".featureSet" + row_id).append(div_content);
			i++;
	});

	//Ballerina by guide Content

	var guide_data = {
		"Ballerina Language Concepts":[{"name": "RESTful Service", "desc": "Building a comprehensive RESTful Web Service using Ballerina.", "url": "restful-service", "git": ""},
			{"name": "Database Interaction", "desc": "Use WebSockets to develop an interactive web application and build the application server using Ballerina language.", "url": "data-backed-service ", "git": ""},
			{"name": "WebSockets", "desc": "Sending messages with Apache Kafka using Ballerina language.", "url": "websocket-integration", "git": ""},
			{"name": "Swagger / OpenAPI", "desc": "Building a comprehensive RESTful Web Service using Ballerina.", "url": "open-api-based-service", "git": ""},
			{"name": "Service Composition", "desc": "Integrating two or more services together to automate a particular task using Ballerina language.", "url": "service-composition", "git": ""},
			{"name": "Parallel Service Orchestration", "desc": "Building a database backed RESTful web service.", "url": "parallel-service-orchestration", "git": ""},
			{"name": "Endpoint Resiliency", "desc": "Managing multiple database transactions using Ballerina.", "url": "resiliency-timeouts", "git": ""},
			{"name": "Circuit Breaker", "desc": "Implementing a service composition using Ballerina language.", "url": "resiliency-circuit-breaker", "git": ""},
			{"name": "Failover and Load Balancing", "desc": "Adding a circuit breaker pattern to a potentially-failing remote backend.", "url": "loadbalancing-failover", "git": ""},
			{"name": "Transactions", "desc": "Incorporating resilience patterns like timeouts and retry to deal with potentially-busy remote backend services.", "url": "managing-database-transactions", "git": ""}
	]};

	var i = 0;
	var div_content;
	$.each(guide_data, function (key, value) {
			//get title
			div_content = "";

			div_content += '<ul>';
			div_content += '<li class="cTableTitle">' + key + '</li>';

			$.each(value, function (exkey, guide) {

					var name = guide['name'];
					var desc = guide['desc'];
					var url = guide['url'];
					var git = guide['git'];

					div_content += '<li><a href="/learn/guides/' + url + '">' + name + '</a></li>';
			});

			div_content += '</ul>';

			var row_id = i % 3;
			$(".bbgfeatureSet" + row_id).append(div_content);
			i++;
	});

});
