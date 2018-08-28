import ballerina/http;
import ballerina/log;
import ballerina/runtime;

endpoint http:Client backendClientEP {
    url: "http://localhost:8080",
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

service<http:Service> legacyEndpoint bind { port: 9090 } {
    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    invokeEndpoint(endpoint caller, http:Request request) {
        http:Response backendRes = check backendClientEP->forward("/hello", 
                                                                       request);
        caller->respond(backendRes) but {
            error e => log:printError("Error sending response", err = e)
        };
    }
}