import ballerina/log;
import wso2/kafka;
import ballerina/internal;
import ballerina/io;

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
            io:ByteChannel channel = io:openFile("/some/filePath", io:APPEND);
            int offset = 0;
            int writtenBytes = check channel.write(serializedMsg, offset);
            while (writtenBytes == lengthof serializedMsg) {
                writtenBytes = check channel.write(serializedMsg, writtenBytes) + writtenBytes;
            }
        }
    }
}