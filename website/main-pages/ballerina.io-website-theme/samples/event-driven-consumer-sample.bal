import ballerina/log;
import wso2/kafka;
import ballerina/internal;

// Kafka consumer endpoint
endpoint kafka:SimpleConsumer consumer {
    bootstrapServers: "localhost:9092, localhost:9093",
    groupId: "inventorySystemd",
    topics: ["product-price"],
    pollingInterval:1000
};

// Kafka service that listens from the topic 'product-price'
// 'inventoryControlService' subscribed to new product price updates from
// the product admin and updates the Database.
service<kafka:Consumer> kafkaService bind consumer {
    // Triggered whenever a message added to the subscribed topic
    onMessage(kafka:ConsumerAction consumerAction, kafka:ConsumerRecord[] records) {
        // Dispatched set of Kafka records to service, We process each one by one.
        foreach entry in records {
            byte[] serializedMsg = entry.value;
            // Convert the serialized message to string message
            string msg = internal:byteArrayToString(serializedMsg, "UTF-8");
            log:printInfo("New message received from the product admin");
            log:printInfo("Topic: " + entry.topic + "; Received Message: " + msg);
            log:printInfo("Database updated with the new price for the product");
        }
    }
}