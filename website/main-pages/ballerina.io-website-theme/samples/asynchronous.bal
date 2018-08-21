import ballerina/io;

function main(string... args) {
    // any function or remote endpoint can be called asynchronously
    future<int> f1 = start sum(40, 50);

    // "futures" can be passed as parameters into functions
    int result = square(f1);
    io:println("SQ + CB = " + result);
}

function sum (int a, int b) returns (int) { return a + b; }

function square(future<int> f) returns int {
    int n = await f;
    return n*n;
}
