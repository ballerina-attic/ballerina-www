import ballerina/http;
import wso2/kafka;

kafka:SimpleProducer kafkaProducer = new({
    bootstrapServers: "localhost:9092",
    clientID:"basic-producer",
    acks:"all",
    noRetries:3
});

service productAdminService on new http:Listener(9090) {

    resource function updatePrice(http:Caller caller, http:Request request) returns error? {
        json|error reqPayload = request.getJsonPayload();

        if (reqPayload is json) {
            byte[] serializedMsg = reqPayload.toString().toByteArray("UTF-8");
            var result = check kafkaProducer->send(serializedMsg, "product-price", partition = 0);

            http:Response response = new;
            response.setJsonPayload({"Status":"Success"});
            _ = caller->respond(response);
        } else {
            http:Response errResp = new;
            errResp.statusCode = 400;
            errResp.setPayload("Invalid JSON payload received");
            _ = caller->respond(errResp);
        }
        return;
    }
}