import ballerina/http;
import wso2/kafka;

endpoint kafka:SimpleProducer kafkaProducer {
    bootstrapServers: "localhost:9092",
    clientID:"basic-producer",
    acks:"all",
    noRetries:3
};

endpoint http:Listener listener {
    port:9090
};

@http:ServiceConfig {basePath:"/product"}
service<http:Service> productAdminService bind listener {

    @http:ResourceConfig {
        methods:["POST"]
    }
    updatePrice (endpoint client, http:Request request, json reqPayload) {
        json productName = reqPayload.Product;
        json newPrice = reqPayload.Price;

        float newPriceAmount = check <float>newPrice.toString();
        json priceUpdateInfo = {"Product":productName, "UpdatedPrice":newPriceAmount};
        byte[] serializedMsg = priceUpdateInfo.toString().toByteArray("UTF-8");

        kafkaProducer->send(serializedMsg, "product-price", partition = 0);
        http:Response response;
        response.setJsonPayload({"Status":"Success"});
        _ = client->respond(response);
    }
}