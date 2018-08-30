import ballerina/mysql;

function userDefinedSecureOperation(@sensitive string secureParameter) {
}

function main(string... args) {
    //Pass input argument to security sensitive parameter
    userDefinedSecureOperation(args[0]);
    if (isInteger(args[0])) {
        //After sanitizing the content untaint can be used
        userDefinedSecureOperation(untaint args[0]);
    } else {
        error err = { message: "Validation error: ID should be an integer" };
        throw err;
    }

    //Tainted return value cannot be passed into sensitive parameter
    json taintedJson = generateTaintedData();
    userDefinedSecureOperation(check <string>taintedJson.name);

    //Untainted return value can be passed into sensitive parameter
    string sanitizedData = sanitizeAndReturnUntainted(check <string>taintedJson.firstname);
    userDefinedSecureOperation(sanitizedData);
    return;
}

function generateTaintedData() returns @tainted json {
    json j = [{"id":"1001","ccnum":1111,"name":"John@"}];
    return j;
}

function sanitizeAndReturnUntainted(string input) returns @untainted string {
    string regEx = "[^a-zA-Z]";
    return input.replace(regEx, "");
}

function isInteger(string input) returns boolean {
    string regEx = "\\d+";
    boolean isInt = check input.matches(regEx);
    return isInt;
}
