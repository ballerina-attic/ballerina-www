import ballerina/http;
import ballerina/log;

// Server endpoint which listened to inbound http requests 
// a bunch unch of configurations is povided to configure server endpoint
// such as Keep-Alive, timeout, request limits, etc.
endpoint http:Listener listener {
    port: 9090,
    keepAlive: http:KEEPALIVE_ALWAYS,
    timeoutMillis: 12000,
};

// Client endpoint talks to external endpoints. 
// In this case we have used twitter endpoint as the sample. 
// similar to server endpoints client endpoint provides a bunch of
// configuration to configure.
endpoint twitter:Client twitterClient {
    clientId:"<CONSUMER_ID>",
    clientSecret:"<CONSUMER_SECRET>",
    accessToken:"<ACCESS_TOKEN>",
    accessTokenSecret:"<ACCESS_TOKEN_SECRET>"
};

service<http:Service> passthrough bind listener {

    //The passthrough resource allows all HTTP methods since the resource configuration does not explicitly specify
    //which HTTP methods are allowed.
    @http:ResourceConfig {
        path: "/"
    }
    passthrough(endpoint caller, http:Request req) {
        // When tweet is called, it posts message in twitter
        twitter:Status twitterStatus = check twitterClient->tweet("my first Ballerina program", "", "");
        _ = caller->respond("Tweet ID: " + <string> twitterStatus.id 
                                   + ", Tweet: " + twitterStatus.text);
    }
}