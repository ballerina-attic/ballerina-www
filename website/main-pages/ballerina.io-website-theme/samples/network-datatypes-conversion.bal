import ballerina/http;
import ballerina/log;
import ballerina/io;

endpoint http:Client backendClientEP {
    url: "http://b.content.wso2.com"
};

service<http:Service> hello bind { port: 9090 } {

    sayHello(endpoint caller, http:Request req) {
        var params = req.getQueryParams();
        int yearParam = check <int>params.year;
        var backendResponse = backendClientEP->get("/sites/all/ballerina-day/sample.json");
        match backendResponse {
            http:Response response => {
                json bookStore = check response.getJsonPayload();
                json filteredBooks = filterBooks(bookStore, yearParam);
                response.setPayload(untaint filteredBooks);
                caller->respond(response) but { error e => log:printError("Error sending response", err = e) };
            }
            error responseError => {
                io:println(responseError.message);
            }
        }
    }
}

function filterBooks(json bookStore, int yearParam) returns json {
    json filteredBooks;
    int index;
    foreach book in  bookStore.store.books {
        match book.year {
            int year => {
                if (year > yearParam) {
                    filteredBooks[index] = book;
                    index++;
                }
            }
            any a => {
                io:println("incorrect year: ", a);
            }
        }
    }
    return filteredBooks;
}