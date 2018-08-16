import ballerina/http;
import ballerina/log;
import ballerina/io;

// Back-end server to which client endpoint connets.
endpoint http:Client backendClientEP {
    url: "http://b.content.wso2.com"
};

// Retrieves a JSON response from the back-end. 
// JSON response contains an array of book details. 
// Service filters out all the books which have been published after year 1900. 
// Then converts it into a XML before sending back the response.
service<http:Service> store bind { port: 9090 } {

    bookDetails(endpoint caller, http:Request req) {
        http:Response response = check backendClientEP->get("/sites/all/ballerina-day/sample.json");
        json bookStore = check response.getJsonPayload();
        json filteredBooksJson = filterBooks(bookStore, 1900);
        // Converts the json into xml
        xml filteredBooksXml = check filteredBooksJson.toXML({});
        response.setPayload(untaint filteredBooksXml);
        // Send back the response
        caller->respond(response) but { error e => log:printError("Error sending response", err = e) };
    }
}

// Filters books which are published after year 1900
function filterBooks(json bookStore, int yearParam) returns json {
    json filteredBooks;
    int index;
    foreach book in bookStore.store.books {
        int year = check <int>book.year;
        if (year > yearParam) {
            filteredBooks[index] = book;
            index++;
        }
    }
    return filteredBooks;
}