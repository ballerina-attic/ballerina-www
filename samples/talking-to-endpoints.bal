import ballerina.net.http;
import ballerina.io;

function main (string[] args) {
    endpoint<http:HttpClient> weatherEP {
        create http:HttpClient("http://samples.openweathermap.org", {});
    }
    http:OutRequest newRequest = {};
    http:InResponse clientResponse = {};
    http:HttpConnectorError err;
    float lat = 35;
    float lon = 139;
    string resourceURL = string `/data/2.5/weather?lat={{lat}}&lon={{lon}}&appid=b1b1`;
    clientResponse, err = weatherEP.get(resourceURL, newRequest);
    if (err != null) {
        io:println("Error " + err.message);
    } else {
        io:println(clientResponse.getStringPayload());
    }
}