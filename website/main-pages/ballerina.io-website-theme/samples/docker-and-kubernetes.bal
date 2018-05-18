import ballerina/http;
import ballerinax/kubernetes;

// Tell Kubernetes which endpoint to expose and how
@kubernetes:Service {
    serviceType: "NodePort",
    name: "ballerina-demo"
}
endpoint http:Listener listener {
    port: 9090
};

// Generate Docker image and Kubernetes deployment artifacts
// for that service to be started with kubectl apply -f
@kubernetes:Deployment {
    // generate docker image
    image: "demo/ballerina-demo",
    name: "ballerina-demo"
}

// Enable Horizontal Pod Autoscaler (HPA)
@kubernetes:HPA {
    minReplicas: 1,
    maxReplicas: 5,
    cpuPercentage: 50
}

service<http:Service> hello bind listener {
    hi (endpoint caller, http:Request request) {
        http:Response res;
        res.setTextPayload("Hello World!\n");
        _ = caller->respond(res);
    }
}