import ballerina/http;
import ballerina/io;
import ballerina/time;


// ***** This service acts as a backend and is not exposed via playground samples ******

endpoint http:ServiceEndpoint listener {
    port:9095
};
@http:ServiceConfig {basePath:"/localtime"}
service<http:Service> time bind listener {
    @http:ResourceConfig{
        path: "/",  methods: ["GET"]
    }
    sayHello (endpoint caller, http:Request request) {
        http:Response response = {};
        time:Time currentTime = time:currentTime();
        string customTimeString = currentTime.format("yyyy-MM-dd'T'HH:mm:ss");

        json timeJ = {currentTime : customTimeString };
        response.setJsonPayload(timeJ);
        _ = caller -> respond(response);
    }
}