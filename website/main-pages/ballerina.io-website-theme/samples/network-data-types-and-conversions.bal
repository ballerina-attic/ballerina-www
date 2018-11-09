import ballerina/http;

endpoint http:Client backendEP {
    url: "http://b.content.wso2.com"
};

service<http:Service> store bind { port: 9090 } {

    bookDetails(endpoint caller, http:Request req) {
        http:Response response = check backendEP->get(
            "/sample.json");

        json bookStore = check response.getJsonPayload();
        json filteredBooksJson = filterBooks(bookStore, 1900);
        xml filteredBooksXml = check filteredBooksJson.toXML({});

        response.setPayload(untaint filteredBooksXml);

        _ = caller->respond(response);
    }

}

function filterBooks(json bookStore, int yearParam) returns json {

    json filteredBooks;
    int index;

    foreach book in bookStore.store.books {
        int year = check <int>book.year;
        if (year > yearParam) {
            filteredBooks[index] = book;
            index += 1;
        }
    }

    return filteredBooks;

}