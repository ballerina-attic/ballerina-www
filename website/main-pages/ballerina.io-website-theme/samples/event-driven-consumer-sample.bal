import wso2/kafka;
import ballerina/io;

endpoint kafka:SimpleConsumer consumer {
    bootstrapServers: "localhost:9092, localhost:9093",
    groupId: "inventorySystemd",
    topics: ["product-price"],
    pollingInterval:1000
};

service<kafka:Consumer> kafkaService bind consumer {
    onMessage(kafka:ConsumerAction consumerAction, kafka:ConsumerRecord[] records) {
        foreach entry in records {
            byte[] serializedMsg = entry.value;
            io:ByteChannel byteChannel = io:openFile("/some/Path", io:APPEND);
            int writtenBytes = check byteChannel.write(serializedMsg, 0);
        }
    }
}