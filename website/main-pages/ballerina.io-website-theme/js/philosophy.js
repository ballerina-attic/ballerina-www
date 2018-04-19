$(document).ready(function () {

var example_data = [
	{
			"title": "Integration Introduction Examples",
			"column": 0,
			"samples": [
					{"name": "Hello World Service", "url": "hello-world-service"},
					{"name": "JSON Transformation", "url": "transform-json"},
					{"name": "JSON to XML Conversion", "url": "json-to-xml-conversion"},
					{"name": "Circuit Breaker", "url": "http-circuit-breaker"},
					{"name": "Load Balancing", "url": "http-load-balancer"},
					{"name": "Failover", "url": "http-failover"},
					{"name": "Tables and SQL", "url": "sql-queries-on-tables"}]
	},
	{
			"title": "Integration Reference",
			"column": 0,
			"samples": [
					{"name": "Content-based Routing", "url": "content-based-routing"},
					{"name": "Websockets", "url": "websocket-basic-sample"},
					{"name": "Distributed Transactions", "url": "distributed-transactions"}]
	},
	{
			"title": "HTTP/HTTPS",
			"column": 0,
			"samples": [
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
					{"name": "HTTP to WebSocket Upgrade", "url": "http-to-websocket-upgrade"}]
	},
	{
			"title": "Language Reference",
			"column": 1,
			"samples": [
					{"name": "Hello World - Main", "url": "hello-world"},
					{"name": "Hello World Parallel", "url": "hello-world-parallel"},
					{"name": "Functions", "url": "functions"},
					{"name": "Async", "url": "async"},
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
					{"name": "Fork Join Variable Access", "url": "fork-join-variable-access"}]
	},
	{
			"title": "Type Reference",
			"column": 1,
			"samples": [
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
					{"name": "Ternary Operators", "url": "ternary"}]
	},
	{
			"title": "Deployment Basics",
			"column": 2,
			"samples": [
					{"name": "Tracing", "url": "observe-tracing"}]
	},
	{
			"title": "Unit Testing",
			"column": 2,
			"samples": [
					{"name": "Assertions", "url": "testerina-assertions"},
					{"name": "Before After Suite", "url": "testerina-before-after-suite"},
					{"name": "Before After", "url": "testerina-before-after"},
					{"name": "Before Each", "url": "testerina-before-each"},
					{"name": "Data Provider", "url": "testerina-data-provider"},
					{"name": "Depends On", "url": "testerina-depends-on"},
					{"name": "Function Mocks", "url": "testerina-function-mocks"},
					{"name": "Groups", "url": "testerina-groups"}]
	},
	{
			"title": "Message Broker",
			"column": 2,
			"samples": [
					{"name": "MB Simple Queue Message Producer", "url": "mb-simple-queue-message-producer"},
					{"name": "MB Simple Queue Message Receiver", "url": "mb-simple-queue-message-receiver"},
					{"name": "MB Simple Topic Message Publisher", "url": "mb-simple-topic-message-publisher"},
					{"name": "MB Simple Topic Message Subscriber", "url": "mb-simple-topic-message-subscriber"}]
	},
	{
			"title": "WebSockets",
			"column": 2,
			"samples": [
					{"name": "WebSocket Chat Application", "url": "websocket-chat-application"},
					{"name": "WebSocket Proxy Server", "url": "websocket-proxy-server"}]
	},
	{
			"title": "JMS",
			"column": 2,
			"samples": [
					{"name": "Durable Topic Message Subscriber", "url": "jms-durable-topic-message-subscriber"},
					{"name": "Queue Message Producer Transactional", "url": "jms-queue-message-producer-transactional"},
					{"name": "Queue Message Producer", "url": "jms-queue-message-producer"},
					{"name": "Queue Message Receiver Sync Client Ack", "url": "jms-queue-message-receiver-sync-client-ack"},
					{"name": "Queue Message Receiver Sync", "url": "jms-queue-message-receiver-sync"},
					{"name": "Queue Message Receiver with Client Acknowledgment", "url": "jms-queue-message-receiver-with-client-acknowledgment"},
					{"name": "Queue Message Receiver", "url": "jms-queue-message-receiver"},
					{"name": "Simple Durable Topic Message Subscriber", "url": "jms-simple-durable-topic-message-subscriber"},
					{"name": "Simple Queue Message Producer", "url": "jms-simple-queue-message-producer"},
					{"name": "Simple Queue Message Receiver", "url": "jms-simple-queue-message-receiver"},
					{"name": "Simple Topic Message Producer", "url": "jms-simple-topic-message-producer"},
					{"name": "Simple Topic Message Subscriber", "url": "jms-simple-topic-message-subscriber"},
					{"name": "Topic Message Producer", "url": "jms-topic-message-producer"},
					{"name": "Topic Message Subscriber", "url": "jms-topic-message-subscriber"}]
	},
	{
			"title": "Standard Library",
			"column": 3,
			"samples": [
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
					{"name": "Task Appointment", "url": "task-appointment"}]
	},
	{
			"title": "Security",
			"column": 3,
			"samples": [
					{"name": "Taint Checking", "url": "taint-checking"}]
	},
	{
			"title": "Data Management",
			"column": 3,
			"samples": [
					{"name": "SQL Client Connector", "url": "sql-connector"}]
	},
	{
			"title": "Streams",
			"column": 3,
			"samples": [
					{"name": "Streams", "url": "streams"},
					{"name": "Streams within Services", "url": "streams-within-services"},
					{"name": "Streams Sequences", "url": "streams-sequences"},
					{"name": "Streams Patterns", "url": "streams-patterns"},
					{"name": "Streams Join", "url": "streams-join"}]
	},
	{
			"title": "gRPC",
			"column": 3,
			"samples": [
					{"name": "Bidirectional Streaming", "url": "grpc-bidirectional-streaming"},
					{"name": "Client Streaming", "url": "grpc-client-streaming"},
					{"name": "Secured Unary", "url": "grpc-secured-unary"},
					{"name": "Server Streaming", "url": "grpc-server-streaming"},
					{"name": "Unary Blocking", "url": "grpc-unary-blocking"},
					{"name": "Unary Non Blocking", "url": "grpc-unary-non-blocking"}]
	}
];

	var div_content;
	$.each(example_data, function (key, value) {
			//get title
			div_content = "";

			div_content += '<ul>';
			div_content += '<li class="cTableTitle">' + value['title'] + '</li>';

			$.each(value['samples'], function (exkey, example) {
					var link = example['url'];
					div_content += '<li><a href="/learn/by-example/' + link + '.html">' + example['name'] + '</a></li>';
			});

			div_content += '</ul>';
			$(".featureSet" + value['column']).append(div_content);
			i++;

	});

	//Ballerina by guide Content

	var guide_data = {
		"Integration With Ballerina":[{"name": "RESTful Service", "desc": "Develop and deploy a Ballerina RESTful Web service", "url": "restful-service", "git": ""},
			{"name": "Database Interaction", "desc": "Service that performs CRUD operations with a SQL database", "url": "data-backed-service", "git": ""},
			{"name": "WebSockets", "desc": "Develop WebSocket service that handels JavaScrip WebSocket API calls", "url": "websocket-integration", "git": ""},
			{"name": "Swagger / OpenAPI", "desc": "", "url": "open-api-based-service", "git": ""},
			{"name": "Service Composition", "desc": "A composite microservice/integration microservice that create a composition of existing microservices", "url": "service-composition", "git": ""},
			{"name": "Parallel Service Orchestration", "desc": "Building a database backed RESTful web service.", "url": "parallel-service-orchestration", "git": ""},
			{"name": "Endpoint Resiliency", "desc": "Calling endpoints with retries and timeouts", "url": "resiliency-timeouts", "git": ""},
			{"name": "Circuit Breaker", "desc": "Applying circuit breakers to potentially-failing method calls", "url": "resiliency-circuit-breaker", "git": ""},
			{"name": "Load Balancing", "desc": "", "url": "loadbalancing-failover", "git": ""},
			{"name": "Database Transactions", "desc": "Transaction blocks using Ballerina", "url": "managing-database-transactions", "git": ""}
	],
	"Ballerina With Others":[{"name": "Ballerina API Gateway", "desc": "Ballerina services with policies enforced by Ballerina API Gateway", "url": "api-gateway", "git": ""},
		{"name": "Messaging with JMS", "desc": "Publish and subscribe to messages with a JMS broker", "url": "messaging-with-jms-queues", "git": ""},
		{"name": "Salesforce-Twilio Integration", "desc": "", "url": "salesforce-twilio-integration", "git": ""},
		{"name": "Gmail-SpreedSheet Integration ", "desc": "", "url": "gmail-spreadsheet-integration", "git": ""},
		{"name": "SonaQube-GitHub Integration ", "desc": "", "url": "sonarqube-github-integration", "git": ""}
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

			var row_id = i % 2;
			$(".bbgfeatureSet" + row_id).append(div_content);
			i++;
	});

});
