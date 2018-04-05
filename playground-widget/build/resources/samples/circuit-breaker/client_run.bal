import ballerina/net.http;
import ballerina/io;



endpoint http:SimpleClientEndpoint timeServiceEP {
    url:"http://localhost:9090"
};





function main (string[] args) {

    http:Response response =? timeServiceEP -> get("/resilient/time", {});

    string s =? response.getStringPayload();

    io:println("Response : " + s);





}
