import ballerina/http;
import ballerina/sql;
import ballerina/config;

endpoint http:ServiceEndpoint listener {
    port:9090
};

// Get database credentials via configuration API.
const string user_name = "root";
const string password = "root";
const string DB_NAME="CUSTOMER_DB";

@http:ServiceConfig {
    basePath:"/"
}
service<http:Service> data_service bind listener {

    @http:ResourceConfig {
        methods:["GET"],
        path:"/customer"
    }
    customers (endpoint caller, http:Request req) {

        // Endpoints can connect to dbs with SQL connector
        endpoint sql:Client customerDB {
            database:sql:DB.H2_FILE,
            host:"/sample-db/",
            port:10,
            name:DB_NAME,
            username:user_name,
            password:password,
            options:{ maximumPoolSize:5 }
        };

        // Invoke 'select' command against remote database
        // table primitive type represents a set of records
        table dt =? customerDB -> select(
                                  "SELECT * FROM CUSTOMER",
                                  null,
                                  null);

        // tables can be cast to JSON and XML
        json response =? <json>dt;

        http:Response res = {};
        res.setJsonPayload(response);
        _ = caller -> respond(res);
    }
}

