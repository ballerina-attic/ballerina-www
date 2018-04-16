$(document).ready(function () {
	var example_data = {
			"Basic": ["Hello World", "Hello World Parallel", "Hello World Service"],
			"Variables and Constants": ["Constants", "Global Variables", "Ternary", "Functions", "Errors", "Var"],
			"Statements": ["While", "IF Else", "Foreach", "Throw", "Try/Catch/Finally"],
			"Conversions": ["Identifier Literals", "JSON", "JSON Literals", "JSON Arrays", "JSON/Struct/Map Conversion", "Constrained JSON", "XML", "XML Namespaces", "XML Literal", "XML Attributes", "XML Functions", "JSON To XML Conversion", "XML To JSON Conversion"],
			"Types, Arrays, and Vectors": ["Any Type", "Value Types", "Type Casting", "Type Conversion", "Typeof", "Structs", "Maps", "Arrays", "Array of Arrays", "Table", "Lengthof"],
			"Integration Workflows": ["Iterable Operations", "Worker", "Worker Interaction", "Fork/Join", "Fork/Join Condition Some", "Fork/Join Variable Access", "SQL Connector", "Table with SQL Connector", "Transactions", "Distributed Transactions", "Transformers", "Transform JSON", "Strings", "Blob Type", "Date Time", "File API", "Base Path and Path", "Query/Path/Matrix Param"],
			"HTTP Logic": ["Content Based Routing", "Header Based Routing", "Produces/Consumes", "HTTP Sessions", "HTTP Client Connector", "HTTP Trace Logs", "HTTP 100 Continue", "HTTPS Server Connector", "HTTPS Server/Client Connectors", "HTTP Disable Chunking", "HTTP to WebSocket Upgrade", "HTTP CORS", "HTTP Circuit Breaker", "HTTP Data Binding", "HTTP Failover", "HTTP Load Balancer", "HTTP Forwarded Extension"],
			"API Logic": ["Log API", "Function Pointers", "Lambda", "WebSocket Basic Sample", "WebSocket Chat Application", "WebSocket Proxy Server", "Passthrough", "Mutual SSL", "Caching", "Byte I/O", "Character I/O", "Record I/O", "Config API"],
			"Integration Functions": ["Math Functions", "Task Timer", "Task Appointment", "String Template", "HTTP Redirects", "Inbound Request with Multiparts", "Outbound Request with Multiparts", "Encode Nested BodyParts in Multipart", "Decode Nested BodyParts in Multipart", "Inbound Response with Multiparts", "Outbound Response with Multiparts"]
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
