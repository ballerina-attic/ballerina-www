import wso2/twitter;
import ballerina/http;
import ballerina/config;

endpoint twitter:Client twitterEP {
    clientId: config:getAsString("clientId"),
    clientSecret: config:getAsString("clientSecret"),
    accessToken: config:getAsString("accessToken"),
    accessTokenSecret: config:getAsString("accessTokenSecret"),
    clientConfig: {}
};

service<http:Service> tweeter bind {port:9090} {
    @http:ResourceConfig {
        methods: ["POST"],
        path: "/tweet"
    }
    tweet (endpoint caller, http:Request req) {
        string status = check req.getTextPayload();
        if ( status == "" ) { status = "Hello World"; }

        twitter:Status twitterStatus = check twitterEP -> tweet(status);
        string tweetId = <string> twitterStatus.id;
        string text = twitterStatus.text;
        json jr = { "id": tweetId, "text": text};
        http:Response response = new;
        response.setJsonPayload(jr);
        _ = caller -> respond(response);
    }
}