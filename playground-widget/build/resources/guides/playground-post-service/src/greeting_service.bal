
import ballerina/http;
import ballerina/io;

endpoint http:ServiceEndpoint listener {
    port:9090
};

// Annotations decorate code
// Change the service URL base to '/greeting'
@http:ServiceConfig {
    basePath:"/greeting"
}
service<http:Service> greeting bind listener {

    // Decorate the 'greet' resource to accept POST requests
    @http:ResourceConfig{
        path: "/",
        methods: ["POST"]
    }
    greet (endpoint caller, http:Request request) {
        http:Response response = {};

        // var is a generic data type for assignment
        var reqPayloadVar = request.getStringPayload();

        // match branches logic based upon tpe of variable
        match reqPayloadVar {

            // reqPayloadVar is a string type
            string reqPayload => {
                response.setStringPayload("Hello, "
                    + reqPayload + "!\n");
            }

            // reqPayloadVar is null or any other type
            any | null => {
                io:println("No payload found!");
            }
        }

        _ = caller -> respond(response);
    }
}