import ballerina/io;

function main(string... args) {
    int result = add(5, 6);
    io:println(result);
    // Return value of a function call cannot be ignored.
    // Below line will give a compiler error as
    // variable assignment is required
    add (5, 4);
}

function add(int a, int b) returns (int) {
    // Function parameters are effectively final.
    // Below line will give a compiler error as
    // cannot assign a value to function argument 'a'
    a = 6;
    int total = a + b;
    io:println("Total:" + total);
    return total;
}
