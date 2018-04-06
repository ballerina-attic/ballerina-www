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


        json googQuote = {quote_symbol : "GOOG",
                         name: "Alphabet Inc.",
                         price: 1013.41,
                         closing_time: "April 3 4:00PM EDT",
                         source: "NASDAQ"};


        runtime:sleepCurrentWorker(1000);
        response.setJsonPayload(googQuote);
        _ = caller -> respond(response);
    }
}