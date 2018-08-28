import ballerina/io;

function main(string... args) {
    var result = deleteFile("./files/sample1.txt");
    io:println(result);
    // Return value of a function call cannot be ignored.
    // Below line will give a compiler error as
    // variable assignment is required
    deleteFile ("./files/sample2.txt");
}

function deleteFile(string filePath) returns error? {
    // Function parameters are effectively final.
    // Below line will give a compiler error as
    // cannot assign a value to function argument 'filePath'
    filePath = "./files/test.txt";
    boolean exists = isExists(filePath);
    if(!exists) {
        error e = {message : "File Not found"};
        return e;
    }
    return new(filePath).delete();
}

