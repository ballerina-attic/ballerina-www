import ballerina/http;

http:AuthProvider jwtAuthProvider = {
    scheme:"jwt",
    issuer:"ballerina",
    audience: "ballerina.io",
    certificateAlias: "ballerina",
    trustStore: {
        path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
        password: "ballerina"
    }
};

endpoint http:Client httpEndpoint {
    url: "https://localhost:9090",
    auth: {
        scheme: http:BASIC_AUTH,
        username: "tom",
        password: "1234"
    }
};

endpoint http:SecureListener secureListener {
    port: 9090,
    authProviders:[jwtAuthProvider],
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        },
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
};

@http:ServiceConfig {
    authConfig: {
        authentication: { enabled: true }
    }
}
service<http:Service> echo bind secureListener {
    @http:ResourceConfig {
        authConfig: {
            scopes: ["hello"]
        }
    }
    hello(endpoint caller, http:Request req) {
        http:Response res = check httpEndpoint->get(
            "/secured/endpoint");
        _ = caller->respond(res);
    }
}