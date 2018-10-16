$(document).ready(function () {

	//Ballerina by guide Content

	var guide_data = {
		"Integration With Ballerina":[{"name": "RESTful Service", "desc": "Develop and deploy a Ballerina RESTful Web service", "url": "restful-service", "git": ""},
			{"name": "Database Interaction", "desc": "Service that performs CRUD operations with a SQL database", "url": "data-backed-service", "git": ""},
			{"name": "gRPC", "desc": "Exposing gRPC services from existing JSON and/or SOAP service", "url": "grpc-service", "git": ""},
			{"name": "WebSockets", "desc": "Develop WebSocket service that handels JavaScrip WebSocket API calls", "url": "websocket-integration", "git": ""},
			{"name": "Swagger / OpenAPI", "desc": "", "url": "open-api-based-service", "git": ""},
			{"name": "Service Composition", "desc": "A composite microservice/integration microservice that create a composition of existing microservices", "url": "service-composition", "git": ""},
			{"name": "Asynchronous Invocations", "desc": "", "url": "asynchronous-invocation", "git": ""},
			{"name": "Parallel Service Orchestration", "desc": "Building a database backed RESTful web service.", "url": "parallel-service-orchestration", "git": ""},
			{"name": "Endpoint Resiliency", "desc": "Calling endpoints with retries and timeouts", "url": "resiliency-timeouts", "git": ""},
			{"name": "Circuit Breaker", "desc": "Applying circuit breakers to potentially-failing method calls", "url": "resiliency-circuit-breaker", "git": ""},
			{"name": "Load Balancing", "desc": "", "url": "loadbalancing-failover", "git": ""},
			{"name": "Database Transactions", "desc": "Transaction blocks using Ballerina", "url": "managing-database-transactions", "git": ""},
			{"name": "Streams Processing", "desc": "Consuming and publishing a stateful data stream", "url": "stream-processing", "git": ""},
			{"name": "Building an API Gateway", "desc": "Ballerina services with policies enforced by Ballerina API Gateway", "url": "api-gateway", "git": ""},
			{"name": "Messaging with Ballerina", "desc": "Ballerina services that communicate through Ballerina Message Broker/Reliable and persistent delivery", "url": "messaging-with-ballerina", "git": ""},
			{"name": "Content-based Routing", "desc": "Content-based Routing", "url": "content-based-routing", "git": ""},
			{"name": "Passthrough Messaging", "desc": "Passthrough messaging", "url": "pass-through-messaging", "git": ""},
			{"name": "Message Filtering", "desc": "Message filtering", "url": "message-filtering", "git": ""},
			{"name": "Scatter-Gather Messaging", "desc": "Scatter gather messaging", "url": "scatter-gather-messaging", "git": ""}
	],
	"Integrating Ballerina With Other Products":[{"name": "Messaging with JMS", "desc": "Publish and subscribe to messages with a JMS broker", "url": "messaging-with-jms-queues", "git": ""},
		{"name": "Messaging with Kafka", "desc": "Pub-sub based asynchronous communication with Kafka", "url": "messaging-with-kafka", "git": ""},
		{"name": "Salesforce-Twilio Integration", "desc": "", "url": "salesforce-twilio-integration", "git": ""},
		{"name": "Gmail-Google Sheets Integration", "desc": "", "url": "gmail-spreadsheet-integration", "git": ""},
		{"name": "SonarQube-GitHub Integration ", "desc": "", "url": "sonarqube-github-integration", "git": ""},
		{"name": "Running with Istio ", "desc": "", "url": "ballerina-with-istio", "git": ""}
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

					div_content += '<li><a href="/learn/by-guide/' + url + '">' + name + '</a></li>';
			});

			div_content += '</ul>';

			var row_id = i % 2;
			$(".bbgfeatureSet" + row_id).append(div_content);
			i++;
	});

});

//Generating BBEs
function printExamples() {
		$.getJSON("/learn/by-example/all-bbes.json", function (example_data) {
				$.getJSON("/learn/by-example/built-bbes.json", function (built_example_data) {

						var i = 0;
						var div_content;
						$.each(example_data, function (key, value) {

								//get title
								div_content = "";

								div_content += '<ul>';
								div_content += '<li class="cTableTitle">' + value['title'] + '</li>';

								$.each(value['samples'], function (exkey, example) {
										var link = example['url'];

									 //Filtering out the failed BBEs
										var is_exist = $.inArray(link, built_example_data);
										if (is_exist == -1) {
												return true;
										} else {
												div_content += '<li><a href="/learn/by-example/' + link + '.html">' + example['name'] + '</a></li>';
										}
								});

								div_content += '</ul>';
								$(".featureSet" + value['column']).append(div_content);
								i++;

						});
				});
		});
}
