import ballerina/jdbc;
import ballerina/io;

endpoint jdbc:Client testDB {
    url: "jdbc:h2:file:./local-transactions/Testdb",
    username: "root",
    password: "root"
};

public function main(string... args) {

    // Create the tables
    var ret = testDB->update("CREATE TABLE CUSTOMER (
        ID INTEGER, NAME VARCHAR(30))");

    ret = testDB->update("CREATE TABLE SALARY (ID INTEGER, 
        MON_SALARY FLOAT)");

    // Update two tables within a transaction
    transaction with retries = 4, oncommit = onCommitFunction,

    onabort = onAbortFunction {
        var result = testDB->update("INSERT INTO CUSTOMER(
            ID,NAME) VALUES (1, 'Anne')");
        int count = check testDB->update("INSERT INTO SALARY 
            (ID, MON_SALARY) VALUES (1, 2500)");

        if (count == 0) {
            abort;
        }
    } onretry {
        io:println("Retrying transaction");
    }

    testDB.stop();

}

function onCommitFunction(string transactionId) {
    io:println("Transaction: " + transactionId + " committed");
}

function onAbortFunction(string transactionId) {
    io:println("Transaction: " + transactionId + " aborted");
}

function handleUpdate(int|error returned, string message) {
    match returned {
        int retInt => io:println(message + " status: " + retInt);
        error err => io:println(message + " failed: " + err.message);
    }
}