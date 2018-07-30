import ballerina/io;
import ballerina/runtime;

type StatusCount record {
    string status;
    int totalCount;
};

type Teacher record {
    string name;
    int age;
    string status;
    string school;
};

function testAggregationQuery (stream<StatusCount> filteredStatusCountStream,
                               stream<Teacher> teacherStream) {
    forever {
        from teacherStream where age > 18 window lengthBatch(3)
        select status, count(status) as totalCount
        group by status
        having totalCount > 1
        => (StatusCount [] status) {
            filteredStatusCountStream.publish(status);
        }
    }
}

function main (string... args) {
    stream<StatusCount> filteredStatusCountStream;
    stream<Teacher> teacherStream;
    testAggregationQuery(filteredStatusCountStream, teacherStream);
    filteredStatusCountStream.subscribe(printStatusCount);
    Teacher t1 = {name:"Jane", age:25, status:"single", school:"MIT"};
    Teacher t2 = {name:"Shareek", age:33, status:"single", school:"UCLA"};
    Teacher t3 = {name:"Sue", age:45, status:"married", school:"Stanford"};
    teacherStream.publish(t1);
    teacherStream.publish(t2);
    teacherStream.publish(t3);   
    runtime:sleep(1000);
}

function printStatusCount (StatusCount s) {
    io:println("Event received: status: " + s.status +
               "; total: " + s.totalCount);
}