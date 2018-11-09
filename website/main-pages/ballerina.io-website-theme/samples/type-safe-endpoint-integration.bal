import ballerina/http;

// this is a simple structured object definition in Ballerina
// it can be automatically mapped into JSON and back again
type Payment record {
	string name,
	string cardnumber,
	int month,
	int year,
	int cvc;
};

endpoint http:Listener listener {
	port : 9090
};

@http:ServiceConfig {
    basePath: "/"
}
service<http:Service> Pay bind listener {
    @http:ResourceConfig {
        path : "/payment",
        methods : ["POST"]
    }
    pay (endpoint caller, http:Request request) {
        // create an empty response object 
        http:Response res = new;
        // check will cause the service to send back an error 
        // if the payload is not JSON
        json payload = check request.getJsonPayload();
        // The next line shows typesafe parsing of JSON into an object
        Payment|error p = <Payment>payload;
        // match allows us to handle the error specifically
        match p {
            Payment x => {
                io:println(x); 
                res.statusCode = 200; 
                // return the JSON that has been created
                res.setJsonPayload(check <json>x); 
            }
            error e => { 
                res.statusCode = 400 ; 
                // return the error message if the JSON failed to parse
                res.setStringPayload(e.message);
            }
            _ = caller -> respond (res);
        }
    }
}