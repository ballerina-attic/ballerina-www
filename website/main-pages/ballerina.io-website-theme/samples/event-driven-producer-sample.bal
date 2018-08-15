import ballerina/http;
import wso2/kafka;

// Constants to store admin credentials
@final string ADMIN_USERNAME = "Admin";
@final string ADMIN_PASSWORD = "Admin";

// Kafka producer endpoint
endpoint kafka:SimpleProducer kafkaProducer {
    bootstrapServers: "localhost:9092",
    clientID:"basic-producer",
    acks:"all",
    noRetries:3
};

// HTTP service endpoint
endpoint http:Listener listener {
    port:9090
};

@http:ServiceConfig {basePath:"/product"}
service<http:Service> productAdminService bind listener {

    @http:ResourceConfig {
        methods:["POST"], 
        consumes:["application/json"],
        produces:["application/json"]
    }
    updatePrice (endpoint client, http:Request request, json reqPayload) {
        http:Response response;

        json username = reqPayload.Username;
        json password = reqPayload.Password;
        json productName = reqPayload.Product;
        json newPrice = reqPayload.Price;

        // Convert the price value to float
        float newPriceAmount = check <float>newPrice.toString();

        // If the credentials does not match with the admin credentials,
        // send an "Access Forbidden" response message
        if (username.toString() != ADMIN_USERNAME ||
            password.toString() != ADMIN_PASSWORD) {
            response.statusCode = 403;
            response.setJsonPayload({"Message":"Access Forbidden"});
            _ = client->respond(response);
            done;
        }

        // Construct and serialize the message to be published to the Kafka topic
        json priceUpdateInfo = {"Product":productName, "UpdatedPrice":newPriceAmount};
        byte[] serializedMsg = priceUpdateInfo.toString().toByteArray("UTF-8");

        // Produce the message and publish it to the Kafka topic
        kafkaProducer->send(serializedMsg, "product-price", partition = 0);
        // Send a success status to the admin request
        response.setJsonPayload({"Status":"Success"});
        _ = client->respond(response);
    }
}