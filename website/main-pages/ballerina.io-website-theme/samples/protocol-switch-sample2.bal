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
        
        http:Response backendRes = check backendEP->post("/test/add", untaint userJSON);
        check caller->send(backendRes.getPayloadAsString());
    }

    getUser(endpoint caller, string id) {
        http:Response backendRes = check backendEP->get("/test/get?id=" + untaint id);
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