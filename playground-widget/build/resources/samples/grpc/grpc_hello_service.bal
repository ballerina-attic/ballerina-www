import ballerina/io;
import ballerina/net.grpc;

// Server endpoint configuration
endpoint grpc:Service ep {
    host:"localhost",
    port:9090``
};

@grpc:serviceConfig {generateClientConnector:true}
service<grpc:Endpoint> GRPCGreeting bind ep {
    hello (endpoint client, string name) {
        io:println("name: " + name);
        string message = "Hello " + name;
        grpc:ConnectorError err = client -> send(message);
        if (err != null) {
            io:println("Error in grpc_greeting : " + err.message);
        }
        _ = client -> complete();
    }
}