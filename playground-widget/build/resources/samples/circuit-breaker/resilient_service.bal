import ballerina/net.http;
import ballerina/io;

json previousRes;
boolean cbOpen = false;

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
      httpStatusCodes:[400, 404, 500]
  },
  // URI of the remote service
  targets: [{ uri: "http://localhost:9096"}],
  // Invocation timeout - independent of circuit
  endpointTimeout:6000
};


@http:ServiceConfig {basePath:"/resilient/time"}
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
        if (cbOpen) {
          io:println ("Circuit Breaker switched to CLOSE.");
          cbOpen = false;
        }
        if (res.statusCode == 200) {
          io:println("Remote service invocation successful."+
                   " Actual data received: ");
          previousRes =? res.getJsonPayload();
        } else {  
          // Remote endpoint returns and error.
          io:println("Error received from remote service.");
        }
        _ = caller -> forward(res);
      }

      // Circuit breaker tripped and generates error
      http:HttpConnectorError err => {
        if (!cbOpen) {
          io:println ("Circuit Breaker switched to OPEN.");
          cbOpen = true;
        }

        http:Response errResponse = {};
        io:println("Circuit Breaker: " +
         "OPEN - Remote service invocation is suspended.");

        // Inform client service is unavailable
        errResponse.statusCode = 503;

        // Use the last successful response
        json errJ = { CACHED_RESPONSE:previousRes };
        errResponse.setJsonPayload(errJ);
        _ = caller -> respond(errResponse);
      }
    }

  }
}
