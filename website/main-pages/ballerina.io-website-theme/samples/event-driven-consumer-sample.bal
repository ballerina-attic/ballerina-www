import ballerina/log;
import wso2/kafka;
import ballerina/internal;
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
            io:ByteChannel channel = io:openFile("/some/filePath", io:APPEND);
            int writtenBytes = 0;
            while (writtenBytes == lengthof serializedMsg) {
                writtenBytes = check channel.write(serializedMsg, writtenBytes) + writtenBytes;
            }
        }
    }
}