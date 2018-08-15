import ballerina/http;
import ballerina/log;

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

endpoint http:Client clientEP {
    url: "http://localhost:9092/hello",
    compression: http:COMPRESSION_ALWAYS,
    cache: { isShared: true }
};

service<http:Service> passthrough bind { port: 9090 } {

    //The passthrough resource allows all HTTP methods since the resource configuration does not explicitly specify
    //which HTTP methods are allowed.
    @http:ResourceConfig {
        path: "/"
    }
    passthrough(endpoint caller, http:Request req) {
        // When tweet is called, it posts message in twitter
        twitter:Status twitterStatus = check twitterClient->tweet("my first Ballerina program", "", "");
        caller->respond("Tweet ID: " + <string> twitterStatus.id 
                                   + ", Tweet: " + twitterStatus.text) but { error e =>
                            log:printError("Error sending response", err = e) };
    }
}