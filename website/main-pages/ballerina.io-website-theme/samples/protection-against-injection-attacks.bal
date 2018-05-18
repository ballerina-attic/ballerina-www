// protection against injection attacks
service<http:Service> tweeter bind {port:9090} {
   postMethod (endpoint caller, http:Request req) {
        // data coming over the wire is
        // automatically assumed to be tainted
        string taintedData = check req.getTextPayload();

        // this line will cause a compiler error
        // as the data is tainted and the secureOperation
        // annotation declares that it requires untainted data
        secureOperation(taintedData);

        string untaintedData =
            sanitizeAndReturnUntainted(taintedData);

        // this line will compile
        secureOperation(untaintedData);
    }
}

// @sensitive indicates that this method
// requires untainted data
function secureOperation (@sensitive string data) {
    io:println(data);
}

// the @untainted annotation indicates that the return
// from this method is no longer tainted
function sanitizeAndReturnUntainted (string input) returns @untainted string {
    string regEx = "[^a-zA-Z]";
    return input.replace(regEx, "");
}