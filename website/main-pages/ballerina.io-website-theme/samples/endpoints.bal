import ballerina/config;
import ballerina/http;
import wso2/twitter;

endpoint http:Listener listener {
    port: 9090,
    keepAlive: http:KEEPALIVE_ALWAYS,
    timeoutMillis: 12000
};

endpoint twitter:Client twitterClient {
    clientId: config:getAsString("consumer_id"),
    clientSecret: config:getAsString("consumer_secret"),
    accessToken: config:getAsString("access_token"),
    accessTokenSecret: config:getAsString("access_token_secret")
};

service<http:Service> passthrough bind listener {

    @http:ResourceConfig {
        path: "/"
    }
    passthrough(endpoint caller, http:Request req) {
        twitter:Status twitterStatus = check twitterClient->tweet(
                "Hello", "", "");
        _ = caller->respond("Tweet ID: " + <string> twitterStatus.id 
                 + ", Tweet: " + twitterStatus.text);
    }

}