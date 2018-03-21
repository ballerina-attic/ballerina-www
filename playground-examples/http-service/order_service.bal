import ballerina.net.http;
import ballerina.log;


@Description {value:"Simple order retrieval service."}
@http:configuration {basePath:"/"}
service<http> OrderService {

    map orders_map = {"1":"sample order : 1\n", "2":"sample order :2\n"};

    @Description {value:"Resource that retrieves order based on the order id path parameter."}
    @http:resourceConfig {
        methods:["GET"],
        path:"/order/{orderId}"
    }
    resource findOrder (http:Connection conn, http:InRequest req, string orderId) {
        http:OutResponse res = {};
        var order_content, err = (string )orders_map[orderId];

        if (err == null) {
            res.setStringPayload(order_content);
            log:printInfo("Order retrieved : Order ID - " + orderId);
        } else {
            string error_message = "Invalid order : Order ID - " + orderId;
            res.statusCode = 500;
            res.setStringPayload(error_message);
            log:printInfo(error_message);
        }
        _ = conn.respond(res);
    }
}
