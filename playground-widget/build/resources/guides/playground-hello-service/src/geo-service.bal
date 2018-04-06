import ballerina/net.http;
import ballerina/io;

@Description {value:"Attributes associated with the service endpoint is defined here."}
endpoint http:ServiceEndpoint httpListenerEP {
    port:9090
};

endpoint http:ClientEndpoint googleMapGeoEP {
    targets: [{uri: "https://maps.googleapis.com"}]
};


@Description {value:""}
@http:ServiceConfig {basePath:"/location"}
service<http:Service> geocodeService bind httpListenerEP {

    @Description {value:""}
    @http:ResourceConfig {
        methods:["GET"],
        path:"/coordinates"
    }
    getGeoCode (endpoint caller, http:Request req) {
        http:Response res = {};
        var latlngQueryParams = req.getQueryParams();
        var latlng = <string> latlngQueryParams.latlng;

        string resourceURL = string `/maps/api/geocode/json?latlng={{latlng}}`;
        var clientResponse = googleMapGeoEP -> get (resourceURL, {});

        match clientResponse {
            http:Response response => {
                _ = caller -> forward(response);
            }
            http:HttpConnectorError err => {
                http:Response errorRes = {};
                errorRes.statusCode = 500;
                errorRes.setStringPayload(err.message);
                _ = caller -> respond(errorRes);
            }
        }
    }
}
