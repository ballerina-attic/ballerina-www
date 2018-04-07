import ballerina/http;
import ballerina/io;

string previousRes;

endpoint http:ServiceEndpoint listener {
  port:9090
};

// Endpoint with circuit breaker can short circuit responses
// under some conditions. Circuit flips to OPEN state when
// errors or responses take longer than timeout.
// OPEN circuits bypass endpoint and return error.
endpoint http:ClientEndpoint legacyServiceResilientEP {
  circuitBreaker: {
    // failures allowed
    failureThreshold:0,
    
    // reset circuit to CLOSED state after timeout
    resetTimeout:3000,

    // error codes that open the circuit
    statusCodes:[400, 404, 500]
  },

  // URI of the remote service
  targets: [{ url: "http://localhost:9095"}],

  // Invocation timeout - independent of circuit
  endpointTimeout:6000
};

@http:ServiceConfig {
  basePath:"/resilient/time"
}
service<http:Service> timeInfo bind listener {

  @http:ResourceConfig {
    methods:["GET"],
    path:"/"
  }
  getTime (endpoint caller, http:Request req) {

    var response = legacyServiceResilientEP
        -> get("/legacy/localtime", {});

    // Match response for successful or failed messages.
    match response {

      // Circuit breaker not tripped, process response
      http:Response res => {
        if (res.statusCode == 200) {
          match res.getStringPayload() {
            string str => {
              previousRes = str;
            }
            error | null err => {
              io:println("Error received from"
                         + " remote service.");
            }
          }
          io:println("Remote service OK. Data received: " +
                        previousRes);
        } else {
          // Remote endpoint returns and error.
          io:println("Error received from remote service.");
          }
          http:Response okResponse = {};
          okResponse.statusCode = 200;
          _ = caller -> respond(okResponse);
        }

        // Circuit breaker tripped and generates error
        http:HttpConnectorError err => {
          http:Response errResponse = {};
          // Use the last successful response
          io:println("Using cached value: " + previousRes);

          // Inform client service is unavailable
          errResponse.statusCode = 503;
          _ = caller -> respond(errResponse);
        }
    }

  }
}