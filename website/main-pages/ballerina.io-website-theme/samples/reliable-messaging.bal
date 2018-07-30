// reliable messaging example
import ballerina/mb;
import ballerina/log;

endpoint mb:SimpleQueueReceiver listener {
	host: "localhost",   // Optional location of the AMQP broker
	port: 5672,          // Optional port of the AMQP broker
	queueName: "MyQueue"
};

service<mb:Consumer> mbListener bind listener {
	onMessage(endpoint consumer, mb:Message message) {
    	string messageText = check message.getTextMessageContent();
    	log:printInfo("Message : " + messageText);
    }
}