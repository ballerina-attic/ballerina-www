import ballerina/http;

map<json> ordersMap;

@http:ServiceConfig { basePath: "/ordermgt" }
service<http:Service> orderMgt bind { port:9090 } {

    @http:ResourceConfig {
        methods: ["GET"],
        produces: ["application/json"],
        path: "/order/{orderId}"
    }
    findOrder(endpoint client, http:Request req, string orderId) {
        json? payload = ordersMap[orderId];
        http:Response response;
        response.setJsonPayload(untaint payload);
        _ = client->respond(response);
    }

    @http:ResourceConfig {
        methods: ["POST"],
        consumes: ["application/json"],
        produces: ["application/json"],
        path: "/order"
    }
    addOrder(endpoint client, http:Request req, json orderReq) {
        string orderId = orderReq.Order.ID.toString();
        ordersMap[orderId] = orderReq;

        json payload = { status: "Order Created.", orderId: orderId };
        http:Response response;
        response.setJsonPayload(untaint payload);
        response.statusCode = 201;
        response.setHeader("Location", "http://localhost:9090/ordermgt/order/" +
                                                                        orderId);

        _ = client->respond(response);
    }
}