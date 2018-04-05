//import ballerina/net.http;
//import ballerina/io;
//
//
//// Network network-accessible endpoint
//// Listens on HTTP on port 9090
//endpoint http:ServiceEndpoint listener {
//    port:9090
//};
//
//// A service is a network-accessible API
//// Advertise on '/hello', port comes from listener endpoint
//service<http:Service> hello bind listener {
//
//    // A resource is an invokable method of the service
//    // 'caller' is the external client that is invoking this resource
//    sayHello (endpoint caller, http:Request request) {
//        http:Response response = {};
//
//        // Retrieve the client's request body
//        var reqPayloadVar = request.getStringPayload();
//
//        match reqPayloadVar {
//            string reqPayload => {
//                // set the response payload
//                response.setStringPayload("Hello, "
//                    + reqPayload + "\n");
//            }
//            any | null => {
//                io:println("No payload found!");
//            }
//        }
//        // Send a response back to caller.
//        _ = caller -> respond(response);
//    }
//}