import ballerina/http;
import ballerina/log;

endpoint http:Listener listener {
    port: 9090,
    keepAlive: http:KEEPALIVE_ALWAYS,
    timeoutMillis: 12000
};

endpoint http:Client clientEP {
    url: "http://localhost:9092/hello",
    compression: http:COMPRESSION_ALWAYS,
    cache: { isShared: true }
};

service<http:Service> passthrough bind { port: 9090 } {

    //The passthrough resource allows all HTTP methods since the resource configuration does not explicitly specify
    //which HTTP methods are allowed.
    @http:ResourceConfig {
        path: "/"
    }
    passthrough(endpoint caller, http:Request req) {
        // When `forward()` is called on the backend client endpoint, it forwards the request that the passthrough
        // resource received to the backend. When forwarding, the request is made using the same HTTP method that was
        // used to invoke the passthrough resource. The `forward()` function returns the response from the backend if
        // there are no errors.
        // var clientResponse = clientEP->forward("/", req);
        http:Response clientResponse = check clientEP->forward("/", req);
        caller->respond(clientResponse) but { error e =>
                            log:printError("Error sending response", err = e) };
    }
}