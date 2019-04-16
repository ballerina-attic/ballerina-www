import ballerina/http;

map<json> ordersMap = {};

@http:ServiceConfig { basePath: "/ordermgt" }
service orderMgt on new http:Listener(9090) {

    @http:ResourceConfig {
        methods: ["GET"],
        produces: ["application/json"],
        path: "/order/{orderId}"
    }
    resource function findOrder(http:Caller caller, http:Request req,
                                string orderId) {
        json? payload = ordersMap[orderId];

        http:Response response = new;
        response.setPayload(untaint payload);

        _ = caller->respond(response);
    }

    @http:ResourceConfig {
        methods: ["POST"],
        consumes: ["application/json"],
        produces: ["application/json"],
        path: "/order"
    }
    resource function addOrder(http:Caller caller, http:Request req) {
        json|error orderReq = req.getJsonPayload();
        if (orderReq is json) {
            string orderId = orderReq.Order.ID.toString();
            ordersMap[orderId] = orderReq;

            json payload = { status: "Order Created.", orderId: orderId };

            http:Response response = new;
            response.setPayload(untaint payload);
            response.statusCode = 201;
            response.setHeader("Location",
                "http://localhost:9090/ordermgt/order/" + orderId);

            _ = caller->respond(response);
        } else {
            http:Response response = new;
            response.statusCode = 400;
            _ = caller->respond(response);
        }
    }
}