import ballerina/grpc;
import ballerina/http;

endpoint grpc:Listener listener {
    port:9090
};

endpoint http:Client backendEP {
    url: "http://b.content.wso2.com"
};

service UserProfile bind listener {
    int nextUserNo = 1;

    addUser(endpoint caller, UserInfo userInfo) {
        User user = {id:<string>nextUserNo, info: userInfo};
        json userJSON = check <json>user;
        nextUserNo++;
        
<<<<<<< HEAD:website/main-pages/ballerina.io-website-theme/samples/protocol-switch-sample2.bal
        http:Response backendRes = check backendEP->post("/test/add", untaint userJSON);
=======
        http:Response backendRes = check backendClientEP->post("/test/add", 
                                                               untaint userJSON);
>>>>>>> ccd914ff7fe493d2e2f96201308e8511c8cf2878:website/main-pages/ballerina.io-website-theme/samples/protocol-conversions.bal
        check caller->send(backendRes.getPayloadAsString());
    }

    getUser(endpoint caller, string id) {
<<<<<<< HEAD:website/main-pages/ballerina.io-website-theme/samples/protocol-switch-sample2.bal
        http:Response backendRes = check backendEP->get("/test/get?id=" + untaint id);
=======
        http:Response backendRes = check backendClientEP->get("/test/get?id=" + 
                                                                     untaint id);
>>>>>>> ccd914ff7fe493d2e2f96201308e8511c8cf2878:website/main-pages/ballerina.io-website-theme/samples/protocol-conversions.bal
        json userJson = check backendRes.getJsonPayload();
        User user = check <User>userJson;
        check caller->send(user);
    }
}

type UserInfo record {
    // contains name, age, etc
};

type User record {
    // contains the id and userinfo of user
};