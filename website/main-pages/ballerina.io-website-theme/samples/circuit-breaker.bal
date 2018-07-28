import ballerina/http;
// circuit breaker example
endpoint http:Client backendClientEP {
    url: "http://localhost:8080",
    circuitBreaker: {
        rollingWindow: {
            timeWindowMillis: 10000,
            bucketSizeMillis: 2000,
            requestVolumeThreshold: 0
        },
        failureThreshold: 0.2,
        resetTimeMillis: 10000,
        statusCodes: [400, 404, 500]
    },    timeoutMillis: 2000
};