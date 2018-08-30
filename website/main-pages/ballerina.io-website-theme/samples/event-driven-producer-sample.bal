import ballerina/http;
import wso2/kafka;

endpoint kafka:SimpleProducer kafkaProducer {
    bootstrapServers: "localhost:9092",
    clientID:"basic-producer",
    acks:"all",
    noRetries:3
};

service<http:Service> productAdminService bind { port:9000 } {

    updatePrice (endpoint client, http:Request request, json reqPayload) {
        json productName = reqPayload.Product;
        json newPrice = reqPayload.Price;

        json priceUpdateInfo = {"Product":productName, "UpdatedPrice":newPrice};
        byte[] serializedMsg = priceUpdateInfo.toString().toByteArray("UTF-8");

        kafkaProducer->send(serializedMsg, "product-price", partition = 0);
        
        http:Response response;
        response.setJsonPayload({"Status":"Success"});
        _ = client->respond(response);
    }
}