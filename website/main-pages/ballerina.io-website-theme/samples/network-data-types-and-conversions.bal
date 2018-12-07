import ballerina/http;

http:Client backendEP = new("http://ballerina.io/samples");

service store on new http:Listener(9090) {

    resource function bookDetails(http:Caller caller, http:Request req) {
        http:Response|error response = backendEP->get("/bookstore.json");

        if (response is http:Response) {
            json bookStore = check response.getJsonPayload();
            json filteredBooksJson = filterBooks(bookStore, 1900);
            xml filteredBooksXml = check filteredBooksJson.toXML({});

            response.setPayload(untaint filteredBooksXml);

            _ = caller->respond(response);
        } else {
            http:Response resp = new;
            resp.statusCode = 500;
            _ = caller->respond(resp);
        }
    }
}

function filterBooks(json bookStore, int yearParam) returns json {
    json filteredBooks = {};
    int index;

    foreach json book in bookStore.store.books {
        int|error year = int.convert(book.year);

        if (year is int) {
            if (year > yearParam) {
                filteredBooks[index] = book;
                index += 1;
            }
        }
    }

    return filteredBooks;
}