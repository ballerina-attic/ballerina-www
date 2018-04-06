import ballerina/http;
import ballerina/io;
import ballerina/runtime;


// ***** This service acts as a backend and is not exposed via playground samples ******

endpoint http:ServiceEndpoint listener {
    port:9095
};
@http:ServiceConfig {basePath:"/nasdaq/quote"}
service<http:Service> time bind listener {
    @http:ResourceConfig{
        path: "/GOOG",  methods: ["GET"]
    }
    sayHello (endpoint caller, http:Request request) {
        http:Response response = {};
        string googQuote = "GOOG, Alphabet Inc., 1013.41";
        runtime:sleepCurrentWorker(1000);
        response.setStringPayload(googQuote);
        _ = caller -> respond(response);
    }
}