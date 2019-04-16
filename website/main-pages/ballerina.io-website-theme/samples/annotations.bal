import ballerina/http;
import ballerina/swagger;
import ballerinax/kubernetes;

// Generate Docker image and Kubernetes deployment artifacts
// for that service to be started with kubectl apply -f
@kubernetes:Deployment {
    image: "demo/ballerina-demo",
    name: "ballerina-demo"
}

// Generate swagger with: ballerina swagger export demo.bal
@swagger:ServiceInfo {
    title: "Hello World Service",
    serviceVersion: "2.0.0",
    description: "Simple hello world service"
}

// Change the service context
@http:ServiceConfig {
    basePath: "/"
}
service hello on new http:Listener(9090) {

    // Change the resource path and accepted verbs
    @http:ResourceConfig {
        path: "/",
        methods: ["GET"]
    }
    resource function hi(http:Caller caller, http:Request request) {
        http:Response res = new;
        res.setPayload("Hello World!\n");

        _ = caller->respond(res);
    }

}