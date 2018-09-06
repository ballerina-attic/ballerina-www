import ballerina/mysql;

function secureOperation(@sensitive string secureParameter) { }

function main(string... args) {

    // Pass input argument to security sensitive parameter
    secureOperation(args[0]);

    if (isInteger(args[0])) {
        // After sanitizing the content untaint can be used
        secureOperation(untaint args[0]);
    } else {
        error err = { message: "Error: ID should be an integer" };
        throw err;
    }

    // Tainted return value cannot be passed into sensitive parameter
    json taintedJson = generateTaintedData();
    secureOperation(check <string>taintedJson.name);

    // Untainted return value can be passed into sensitive parameter
    string sanitizedData = sanitize(check <string>taintedJson.firstname);
    secureOperation(sanitizedData);

    return;

}

function generateTaintedData() returns @tainted json {
    json j = [{"id":"1001","ccnum":1111,"name":"John@"}];
    return j;
}

function sanitize(string input) returns @untainted string {
    string regEx = "[^a-zA-Z]";
    return input.replace(regEx, "");
}

function isInteger(string input) returns boolean {
    string regEx = "\\d+";
    boolean isInt = check input.matches(regEx);
    return isInt;
}