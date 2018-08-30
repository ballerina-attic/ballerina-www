import ballerina/http;
import ballerina/http;

endpoint http:Listener listener {
    port: 9090,
    keepAlive: http:KEEPALIVE_ALWAYS,
    timeoutMillis: 12000
};

endpoint twitter:Client twitterClient {
    clientId:"<CONSUMER_ID>",
    clientSecret:"<CONSUMER_SECRET>",
    accessToken:"<ACCESS_TOKEN>",
    accessTokenSecret:"<ACCESS_TOKEN_SECRET>"
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