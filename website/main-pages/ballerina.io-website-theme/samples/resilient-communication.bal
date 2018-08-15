import ballerina/http;
import ballerina/log;
import ballerina/runtime;

// Circuit Breakers are used to protect against distributed failure.
// The circuit breaker looks for errors across a rolling time window.
// After the circuit is broken, it does not send requests to
// the backend until the `resetTime`.
endpoint http:Client backendClientEP {
    url: "http://localhost:8080",
    // Circuit breaker configuration options that control the
    // behavior of the Ballerina circuit breaker
    circuitBreaker: {
        failureThreshold: 0.2,
        statusCodes: [400, 404, 500]
    },
    timeoutMillis: 2000,
    retryConfig: {
        backOffFactor: 2,
        count: 3,
        interval: 1000
    }
};

service<http:Service> circuitbreaker bind { port: 9090 } {
    // Create a REST resource within the API.
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    // The parameters include a reference to the caller
    // endpoint and an object of the request data.
    invokeEndpoint(endpoint caller, http:Request request) {
        http:Response backendRes = check backendClientEP->forward("/hello", request);
        caller->respond(backendRes) but {
            error e => log:printError("Error sending response", err = e)
        };
    }
}