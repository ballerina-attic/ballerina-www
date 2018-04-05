import ballerina/net.http;
import ballerina/data.sql;

endpoint http:ServiceEndpoint listener {
    port:9090
};

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
            name:"CUSTOMER_DB",
            username:"root",
            password:"root",
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

