import ballerina/io;
import wso2/kafka;

listener kafka:SimpleConsumer consumer = new({
    bootstrapServers: "localhost:9092, localhost:9093",
    groupId: "inventorySystem",
    topics: ["product-price"],
    pollingInterval:1000
});

service kafkaService on consumer {
    resource function onMessage(kafka:SimpleConsumer simpleConsumer, kafka:ConsumerRecord[] records) returns error? {
        foreach var entry in records {
            byte[] serializedMsg = entry.value;
            io:WritableByteChannel byteChannel = io:openWritableFile("/some/Path", append = true);
            int writtenBytes = check byteChannel.write(serializedMsg, 0);
        }
        return;
    }
}