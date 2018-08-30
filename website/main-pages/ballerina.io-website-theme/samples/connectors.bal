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
<<<<<<< HEAD:website/main-pages/ballerina.io-website-theme/samples/server-client-endpoint.bal
        twitter:Status twitterStatus = check twitterClient->tweet("Hello", "", "");
=======
        twitter:Status twitterStatus = check twitterClient->tweet(
                                    	   "my first Ballerina program", "", "");
>>>>>>> ccd914ff7fe493d2e2f96201308e8511c8cf2878:website/main-pages/ballerina.io-website-theme/samples/connectors.bal
        _ = caller->respond("Tweet ID: " + <string> twitterStatus.id 
                                      	     + ", Tweet: " + twitterStatus.text);
    }
}