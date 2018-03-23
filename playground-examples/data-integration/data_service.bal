import ballerina.net.http;
import ballerina.data.sql;
import ballerina.io;
import ballerina.log;


const string  CUSTOMER_DB = "customer_db";

@Description {value:"Service backed by a H2 database."}
@http:configuration {basePath:"/"}
service<http> data_service {

    endpoint<sql:ClientConnector> customers_db {
        create sql:ClientConnector(sql:DB.H2_FILE, "./", 10,
                                   CUSTOMER_DB, "root", "root", {maximumPoolSize:5});
    }

    @Description {value:"Resource that retrieves customer creation requts and insert the customers into the database."}
    @http:resourceConfig {
        methods:["POST"],
        path:"/customer"
    }
    resource customers (http:Connection conn, http:InRequest req) {
        // Retrieve customer data from request.
        json customerReq = req.getJsonPayload();
        var name, _ = (string) customerReq.name;
        var age, _ = (int) customerReq.age;

        sql:Parameter[] params = [];
        sql:Parameter para1 = {sqlType:sql:Type.VARCHAR, value:name};
        sql:Parameter para2 = {sqlType:sql:Type.INTEGER, value:age};
        params = [para1, para2];

        int update_row_cnt = customers_db.update("INSERT INTO CUSTOMER (NAME, AGE) VALUES (?,?)", params);
        log:printInfo("Inserted row count:" + update_row_cnt);

        table dt = customers_db.select("SELECT * FROM CUSTOMER", null, null);

        // Transform data table into JSON
        var response, _ = <json>dt;
        http:OutResponse res = {};
        res.setJsonPayload(response);
        // Respond back to the client.
        _ = conn.respond(res);

        //ToDO: Handle errors and customers_db.close();
    }
}
