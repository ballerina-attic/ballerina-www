import ballerina/http;
import ballerina/io;
import ballerina/time;
import ballerina/runtime;

endpoint http:ServiceEndpoint listener {
    port:9090
};

@http:ServiceConfig {
    basePath:"/quote"
}
service<http:Service> asyncInvoker bind listener {

    @http:ResourceConfig {
        methods:["GET"],
        path:"/"
    }
    getTime (endpoint caller, http:Request req) {
        endpoint http:SimpleClientEndpoint nasdaqQuoteServiceEP {
            url:"http://localhost:9095"
        };

        io:println(getTimeStamp()
                   + " >> Invoking service async...");
        // Invoke remote service asynchronously and
        // immediately continue without waiting for a response
        future<http:Response | http:HttpConnectorError>
        f1
            = async nasdaqQuoteServiceEP
                            -> get("/nasdaq/quote/GOOG", {});
        io:println(getTimeStamp()
               + " >> Service invocation completed..."
               + " proceed without waiting for a response.");


        // Mimic the workload of the main worker with a loop
        int i = 0;
        while (i < 3) {
            io:println(getTimeStamp() + " >> Do some work."
                       + "... Step " + i);
            i = i + 1;
            runtime:sleepCurrentWorker(200);
        }

        io:println(getTimeStamp()
               + " >> Check for response availability...");
        // Work completed!. Check for the availability of the
        // response and block till it is available.

        var response = await f1;
        io:println(getTimeStamp()
               + " >> Response available! ");
        match response {
            http:Response resp => {
                json responseJ =? resp.getJsonPayload();
                io:println(getTimeStamp()
                    + " >> Response "
                    + responseJ.toString());
                _ = caller -> forward(resp);
            }
            http:HttpConnectorError err => {
                io:println(err.message);
            }
        }
    }
}


// Function to get the current time in custom format.
function getTimeStamp() returns (string) {
    time:Time currentTime = time:currentTime();
    string timeStamp = currentTime.format("HH:mm:ss.SSSZ");
    return timeStamp;
}
