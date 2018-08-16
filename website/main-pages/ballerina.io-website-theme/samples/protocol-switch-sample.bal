import ballerina/io;
import ballerina/grpc;
import ballerina/http;

endpoint UserProfileBlockingClient userProfileBlockingEp {
    url:"http://localhost:9090"
};

@http:ServiceConfig {
    basePath: "/v1/user"
}
service<http:Service> sample bind { port: 9091 } {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/{userid}"
    }
    getUser(endpoint caller, http:Request req, string userid) {
        (User, grpc:Headers) payload = check userProfileBlockingEp->getUser(userid);

        User result;
        (result, _) = payload;
        json responseJson = check <json>result;
        http:Response res = new;
        // A util method to set the JSON payload to the response message.
        res.statusCode = 200;
        res.setJsonPayload(untaint responseJson);
        // Send a response to the client.
        caller->respond(res) but { error e => io:println("Error when responding " + e.message) };
    }

    @http:ResourceConfig {
        methods: ["POST"],
        path: "/"
    }
    addUser(endpoint caller, http:Request req) {
        // The client starts sending the payload once it receives the 100-continue response.
        // Retrieve the payload that is sent by the client.
        http:Response res = new;
        json reqPayload = check req.getJsonPayload();
        UserInfo userInfo = check <UserInfo>reqPayload;
        (string, grpc:Headers) resPayload = check userProfileBlockingEp->addUser(userInfo);

        string result;
        (result, _) = resPayload;
        res.statusCode = 201;
        res.setPayload(result);
        caller->respond(res) but {
            error e => io:println("Error sending response" + e.message)
        };
    }
}

type UserInfo record {
    string name;
    int age;
    string email;
    
};

type User record {
    string id;
    UserInfo info;
    
};

public type UserProfileBlockingStub object {
    
    public grpc:Client clientEndpoint;
    public grpc:Stub stub;

    function initStub (grpc:Client ep) {
        grpc:Stub navStub = new;
        navStub.initStub(ep, "blocking", DESCRIPTOR_KEY, descriptorMap);
        self.stub = navStub;
    }
    
    function addUser (UserInfo req, grpc:Headers? headers = ()) returns ((string, grpc:Headers)|error) {
        
        var unionResp = self.stub.blockingExecute("service.UserProfile/addUser", req, headers = headers);
        match unionResp {
            error payloadError => {
                return payloadError;
            }
            (any, grpc:Headers) payload => {
                any result;
                grpc:Headers resHeaders;
                (result, resHeaders) = payload;
                return (<string>result, resHeaders);
            }
        }
    }
    
    function getUser (string req, grpc:Headers? headers = ()) returns ((User, grpc:Headers)|error) {
        
        var unionResp = self.stub.blockingExecute("service.UserProfile/getUser", req, headers = headers);
        match unionResp {
            error payloadError => {
                return payloadError;
            }
            (any, grpc:Headers) payload => {
                any result;
                grpc:Headers resHeaders;
                (result, resHeaders) = payload;
                return (check <User>result, resHeaders);
            }
        }
    }  
};

public type UserProfileBlockingClient object {
    
    public grpc:Client client;
    public UserProfileBlockingStub stub;

    public function init (grpc:ClientEndpointConfig config) {
        // initialize client endpoint.
        grpc:Client c = new;
        c.init(config);
        self.client = c;
        // initialize service stub.
        UserProfileBlockingStub s = new;
        s.initStub(c);
        self.stub = s;
    }

    public function getCallerActions () returns (UserProfileBlockingStub) {
        return self.stub;
    }
};

@final string DESCRIPTOR_KEY = "service.target/grpc/UserProfile.proto";
map descriptorMap =
{ 
    "service.target/grpc/UserProfile.proto":"0A1D7461726765742F677270632F5573657250726F66696C652E70726F746F1207736572766963651A1E676F6F676C652F70726F746F6275662F77726170706572732E70726F746F1A1B676F6F676C652F70726F746F6275662F656D7074792E70726F746F22460A0855736572496E666F12120A046E616D6518012001280952046E616D6512100A03616765180220012803520361676512140A05656D61696C1803200128095205656D61696C223D0A0455736572120E0A0269641801200128095202696412250A04696E666F18022001280B32112E736572766963652E55736572496E666F5204696E666F222C0A05557365727312230A05757365727318012003280B320D2E736572766963652E557365725205757365727332BD020A0B5573657250726F66696C65123A0A076164645573657212112E736572766963652E55736572496E666F1A1C2E676F6F676C652E70726F746F6275662E537472696E6756616C756512360A0767657455736572121C2E676F6F676C652E70726F746F6275662E537472696E6756616C75651A0D2E736572766963652E5573657212390A0A75706461746555736572120D2E736572766963652E557365721A1C2E676F6F676C652E70726F746F6275662E537472696E6756616C756512480A0A64656C65746555736572121C2E676F6F676C652E70726F746F6275662E537472696E6756616C75651A1C2E676F6F676C652E70726F746F6275662E537472696E6756616C756512350A0B676574416C6C557365727312162E676F6F676C652E70726F746F6275662E456D7074791A0E2E736572766963652E5573657273620670726F746F33",
  
    "google.protobuf.wrappers.proto":"0A0E77726170706572732E70726F746F120F676F6F676C652E70726F746F62756622230A0B446F75626C6556616C756512140A0576616C7565180120012801520576616C756522220A0A466C6F617456616C756512140A0576616C7565180120012802520576616C756522220A0A496E74363456616C756512140A0576616C7565180120012803520576616C756522230A0B55496E74363456616C756512140A0576616C7565180120012804520576616C756522220A0A496E74333256616C756512140A0576616C7565180120012805520576616C756522230A0B55496E74333256616C756512140A0576616C756518012001280D520576616C756522210A09426F6F6C56616C756512140A0576616C7565180120012808520576616C756522230A0B537472696E6756616C756512140A0576616C7565180120012809520576616C756522220A0A427974657356616C756512140A0576616C756518012001280C520576616C756542570A13636F6D2E676F6F676C652E70726F746F627566420D577261707065727350726F746F50015A057479706573F80101A20203475042AA021E476F6F676C652E50726F746F6275662E57656C6C4B6E6F776E5479706573620670726F746F33",
  
    "google.protobuf.empty.proto":"0A0B656D7074792E70726F746F120F676F6F676C652E70726F746F62756622070A05456D70747942540A13636F6D2E676F6F676C652E70726F746F627566420A456D70747950726F746F50015A057479706573F80101A20203475042AA021E476F6F676C652E50726F746F6275662E57656C6C4B6E6F776E5479706573620670726F746F33"
  
};