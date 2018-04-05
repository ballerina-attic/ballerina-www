import ballerina/net.http;
import ballerina/io;
import ballerina/time;
import ballerina/runtime;


// ***** This service acts as a backend and is not exposed via playground samples ******


public  int counter = 1;

endpoint http:ServiceEndpoint listener {
    port:9096
};
@http:ServiceConfig {basePath:"/legacy"}
service<http:Service> legacy_time bind listener {
    @http:ResourceConfig{
        path: "/localtime",  methods: ["GET"]
    }
    getTime (endpoint caller, http:Request request) {
        http:Response response = {};

        if (counter % 5 == 0) {
            io:println("Legacy Service : Behavior - Slow");
            runtime:sleepCurrentWorker(1000);
            counter = counter + 1;
        } else if (counter % 5 == 3) {
            counter = counter + 1;
            response.statusCode = 500;
            io:println("Legacy Service : Behavior - Faulty");
            json errorJ = {error: "Internal error occurred while processing the request."};
            response.setJsonPayload(errorJ);
            _ = caller -> respond(response);
            return;
        } else {
            io:println("Legacy Service : Behavior - Normal");
            counter = counter + 1;
        }

        time:Time currentTime = time:currentTime();
        string customTimeString = currentTime.format("HH:mm:ss");

        json timeJ = {currentTime : customTimeString };
        response.setJsonPayload(timeJ);
        _ = caller -> respond(response);
    }
}
