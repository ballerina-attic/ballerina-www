import ballerina.data.sql;

import ballerina.io;function main (string[] args) {
    endpoint<sql:ClientConnector> testDB {
        create sql:ClientConnector(sql:DB.H2_FILE, "./", 10,
                                   "testdb", "root", "root", {maximumPoolSize:5});
    }

    int ret = testDB.update("CREATE TABLE STUDENT(ID INT AUTO_INCREMENT, AGE INT,
            NAME VARCHAR(255), PRIMARY KEY (ID))", null);


    sql:Parameter[] params = [];
    sql:Parameter para1 = {sqlType:sql:Type.INTEGER, value:8};
    sql:Parameter para2 = {sqlType:sql:Type.VARCHAR, value:"Sam"};
    params = [para1, para2];
    ret = testDB.update("INSERT INTO STUDENT (AGE,NAME) VALUES (?,?)", params);
    io:println("Inserted row count:" + ret);

    table dt = testDB.select("SELECT * FROM STUDENT", null, null);
    var jsonRes, err = <json>dt;
    io:println(jsonRes);

    testDB.close();
}
