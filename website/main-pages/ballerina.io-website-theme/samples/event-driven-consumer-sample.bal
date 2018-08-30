import wso2/kafka;
import ballerina/io;
import ballerina/http;

endpoint kafka:SimpleConsumer consumer {
    bootstrapServers: "localhost:9092, localhost:9093",
    groupId: "inventorySystemd",
    topics: ["product-price"],
    pollingInterval:1000
};

endpoint kafka:SimpleProducer kafkaProducer {
    bootstrapServers: "localhost:9092",
    clientID:"basic-producer",
    acks:"all",
    noRetries:3
};

service<kafka:Consumer> kafkaService bind consumer {
    onMessage(kafka:ConsumerAction consumerAction, kafka:ConsumerRecord[] records) {
        foreach entry in records {
            byte[] serializedMsg = entry.value;
            io:ByteChannel channel = io:openFile("/some/Path", io:APPEND);
            int writtenBytes = check channel.write(serializedMsg, 0);
        }
    }
}

service<http:Service> productAdminService bind { port:9000 } {

    updatePrice (endpoint client, http:Request request, json reqPayload) {
        byte[] serializedMsg = reqPayload.toString().toByteArray("UTF-8");
        kafkaProducer->send(serializedMsg, "product-price", partition = 0);
        
        http:Response response;
        response.setJsonPayload({"Status":"Success"});
        _ = client->respond(response);
    }
}