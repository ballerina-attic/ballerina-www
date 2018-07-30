# How to Write Secure Ballerina Programs

This document demonstrates different security features and controls available within Ballerina, and serves the purpose of providing guidelines on writing secure Ballerina programs.

## Secure by Design

This approach makes it unnecessary for developers to review best practice coding lists that itemize how to avoid security vulnerabilities. The Ballerina compiler ensures that Ballerina programs do not introduce security vulnerabilities.

A taint analysis mechanism is used to achieve this.

Parameters in function calls can be designated as security-sensitive. The compiler will generate an error if you pass untrusted data (tainted data) into a security-sensitive parameter:


```
tainted value passed to sensitive parameter 'sqlQuery'
```

We require developers to explicitly mark all values passed into security-sensitive parameters as 'trusted'. This explicit check forces developers and code reviewers to verify that the values being passed into the parameter are not vulnerable to a security violation.

Ballerina standard library makes sure untrusted data cannot be used with security sensitive parameters such as SQL queries, file paths, file name, permission flags, request URLs and configuration keys, preventing  vulnerabilities, including:

* SQL Injection
* Path Manipulation
* File Manipulation
* Unauthorized File Access
* Unvalidated Redirect (Open Redirect)

### Ensuring security of Ballerina standard libraries
Security sensitive functions and actions of Ballerina standard libraries are decorated with  `@sensitive` parameter annotation that denotes untrusted data (tainted data) should not be passed to the parameter. For example, `sqlQuery` parameter of `ballerina/sql`, `select` action.

```ballerina
public native function select(@sensitive string sqlQuery, typedesc? recordType,
                              boolean loadToMemory = false, Param... parameters)
                             returns @tainted table|error;
```

Consider the following example that constructs a SQL query with a tainted argument:

```ballerina
import ballerina/mysql;

type ResultStudent record {
   string NAME,
};

function main (string... args) {

    endpoint mysql:Client testDB {
       host: "localhost",
       port: 3306
    };

   // Construct student ID based on user input.
   string studentId = "S_" + args[0];

   // Execute select query using the untrusted (tainted) student ID
   var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = " + studentId,
                           ResultStudent);
   testDB.stop();
}
```

The Ballerina compiler will generate an error:

```
tainted value passed to sensitive parameter 'sqlQuery'
```

In order to compile, the program is modified to use query parameters:

```ballerina
sql:Parameter paramId = {sqlType:sql:TYPE_VARCHAR, value:studentId};
var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = ?", ResultStudent,
                        paramId);
```

Please note that it is required to import `ballerina/sql` package to use `sql:Parameter`.

Command-line arguments to Ballerina programs and inputs received through service resources are considered tainted. Additionally, return values of certain functions and actions are marked with `@tainted` annotation to denote that the resulting value should be considered as untrusted data.

For example, the select action of the SQL client connector highlighted above returns a `@tainted table`, which means any value read from a database is considered untrusted.

If return was not explicitly annotated, Ballerina will infer the tainted status of the return by analyzing how tainted status of parameters affect tainted status of the return.

### Securely using tainted data with security sensitive parameters

There can be certain situations where a tainted value must be passed into a security sensitive parameter. In such situations, it is essential to do proper data validation or data sanitization to make sure input does not result in a security threat. Once proper controls are in place, `untaint` unary expression can be used to denote that the proceeding value is trusted:

```ballerina
// Execute select query using the untrusted (tainted) student ID
boolean isValid = isNumeric(studentId);
if (isValid) {
   var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = " +
                           untaint studentId, ResultStudent);
}
// ...
```

Additionally, return values can be annotated with `@untainted` to denote that the return value should be trusted (even though return value is derived from tainted data):

```ballerina
// Execute select query using the untrusted (tainted) student ID
function sanitizeSortColumn (string columnName) returns @untainted string {
   string sanitizedSortColumn = columnName;
   // Sanitize logic to make sure return value is safe
   return sanitizedSortColumn;
}
// ...
```

## Securing Passwords and Secrets

Ballerina provides an API for accessing configuration values from different sources. Please refer to the [Config](https://ballerina.io/learn/by-example/config-api.html) Ballerina by Example for details.

Configuration values containing passwords or secrets should be encrypted. The Ballerina Config API will decrypt such configuration values when being accessed.

Use the following command, in order to encrypt a configuration value:

```
ballerina encrypt
```

The encrypt command will prompt for the plain-text value to be encrypted and an encryption secret.

```
ballerina encrypt
Enter value:

Enter secret:

Re-enter secret to verify:

Add the following to the runtime config:
@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}

Or add to the runtime command line:
-e<param>=@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}
```

Ballerina uses AES, CBC mode with PKCS#5 padding for encryption. The generated encrypted value should be used in place of the plain-text configuration value.

For example, contents of a configuration file that includes a secret value should look as follows:

```
api.secret="@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}"
api.provider="not-a-security-sensitive-value"
```

When running a Ballerina program that uses encrypted configuration values, Ballerina will require the secret used during the encryption process to perform the decryption.

Ballerina will first look for a file named `secret.txt`. If such file exists, Ballerina will read the decryption secret from the file and immediately remove the file to make sure secret cannot be accessed afterwards. If the secret file is not present, the Ballerina program will prompt for the decryption secret.

The file based approach is useful in automated deployments. The file containing the decryption secret can be deployed along with the Ballerina program. The name and the path of the secret file can be configured using the `ballerina.config.secret` runtime parameter:

```
ballerina run -e ballerina.config.secret=path/to/secret/file \
securing_configuration_values.balx
```

## Authentication and Authorization

Ballerina HTTP services can be configured to enforce authentication and authorization.

Ballerina supports JWT based authentication and and Basic Authentication. When Basic Authentication is used, user information can be provided through a configuration file.

_Note: It is recommended to use HTTPS when enforcing authentication and authorization checks, to ensure the confidentiality of sensitive authentication data._

### JWT Based Authentication

Instead of the `http:Listener` used in creating HTTP server listeners, the `http:SecureListener` should be used to enforce authentication and authorization checks. The security checks enforced by the `http:SecureListeneris` can be configured by using `http:AuthProvider`.

To configure JWT based authentication `scheme:"jwt"` should be used.

JWT validation requires several additional `http:AuthProvider` configurations including:

* `issuer` - The issuer of the JWT.
* `audience` - The audience value for the current service.
* `clockSkew` - Clock skew in seconds that can be used to avoid token validation failures due to clock synchronization problems.
* `trustStore` - A trust store containing trusted public key certificates of issuers (used for signature validation).
* `certificateAlias` - Alias of the public key certificate.

For demonstration purposes we use `ballerinaTruststore.p12` included with Ballerina runtime. In a production deployment, the truststore should only contain the public key certificates of the trusted JWT issuers.

```ballerina
import ballerina/http;

http:AuthProvider jwtAuthProvider = {
   scheme:"jwt",
   issuer:"ballerina",
   audience: "ballerina.io",
   clockSkew:10,
   certificateAlias: "ballerina",
   trustStore: {
       path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
       password: "ballerina"
   }
};

endpoint http:SecureListener secureHelloWorldEp {
   port:9091,
   authProviders:[jwtAuthProvider],
   secureSocket: {
       keyStore: {
           path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};

@http:ServiceConfig {
   basePath:"/hello"
}
service<http:Service> helloWorld bind secureHelloWorldEp {

   @http:ResourceConfig {
       methods:["GET"],
       path:"/"
   }
   sayHello (endpoint caller, http:Request req) {
       http:Response resp = new;
       resp.setTextPayload("Hello, World!");
       _ = caller->respond(resp);
   }
}
```

When the service is invoked without authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*

< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< content-length: 38
< server: ballerina/0.970.0-beta6-SNAPSHOT
< date: Mon, 23 Apr 2018 11:00:31 +0530
<
request failed: Authentication failure
```

Since we used JWT authentication scheme, it is now required to send a valid, signed JWT with the HTTP request. Once a request is made with a signed JWT, the service sends a successful response.

```
curl -k -v -H "Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdW
IiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyN
DU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFs
bGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdfQ.X2mHWCr8A5UaJFvjSPUammAC
nTzFsTdre-P5yWQgrwLBmfcpr9JaUuq4sEwp6to3xSKN7u9QKqRLuWH1SlcphDQn6kdF1ZrCgXRQ0HQ
TilZQU1hllZ4c7yMNtMgMIaPgEBrStLX1Ufr6LpDkTA4VeaPCSqstHt9WbRzIoPQ1fCxjvHBP17ShiG
PRza9p_Z4t897s40aQMKbKLqLQ8rEaYAcsoRBXYyUhb_PRS-YZtIdo7iVmkMVFjYjHvmYbpYhNo57Z1
Y5dNa8h8-4ON4CXzcJ1RzuyuFVz1a3YL3gWTsiliVmno7vKyRo8utirDRIPi0dPJPuWi2uMtJkqdkpz
JQ" https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJ
pbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwian
RpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiY
mFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdfQ.X2mHWCr8A5UaJFvjSPUammACnTzFsTdre-P5y
WQgrwLBmfcpr9JaUuq4sEwp6to3xSKN7u9QKqRLuWH1SlcphDQn6kdF1ZrCgXRQ0HQTilZQU1hllZ4c
7yMNtMgMIaPgEBrStLX1Ufr6LpDkTA4VeaPCSqstHt9WbRzIoPQ1fCxjvHBP17ShiGPRza9p_Z4t897
s40aQMKbKLqLQ8rEaYAcsoRBXYyUhb_PRS-YZtIdo7iVmkMVFjYjHvmYbpYhNo57Z1Y5dNa8h8-4ON4
CXzcJ1RzuyuFVz1a3YL3gWTsiliVmno7vKyRo8utirDRIPi0dPJPuWi2uMtJkqdkpzJQ
>

< HTTP/1.1 200 OK
< content-type: text/plain
< content-length: 13
< server: ballerina/0.970.0-beta14-SNAPSHOT
< date: Tue, 24 Apr 2018 20:11:02 +0530
<
Hello, World!
```

JWT sent in the previous example contains following information:

```
{
  "sub": "ballerina",
  "iss": "ballerina",
  "exp": 2818415019,
  "iat": 1524575019,
  "jti": "f5aded50585c46f2b8ca233d0c2a3c9d",
  "aud": [
    "ballerina",
    "Ballerina.org",
    "ballerina.io"
  ]
}
```

The `@http:ServiceConfig` annotation and the `@http:ResourceConfig` annotation have attributes that can be used to further configure the security enforcements. For example, authentication can be disabled only for a particular service `authConfig` attribute of `@http:ServiceConfig`:

```ballerina
@http:ServiceConfig {
   basePath:"/hello",
   authConfig:{
      authentication:{enabled:false}
   }
}
service<http:Service> helloWorld bind secureHelloWorldEp {
// ...
```

Furthermore, authentication can be disabled only for a particular resource by using `authConfig` attribute of `@http:ResourceConfig`:

```ballerina
@http:ResourceConfig {
   methods:["GET"],
   path:"/",
   authConfig:{
      authentication:{enabled:false}
   }
}
sayHello (endpoint caller, http:Request req) {
// ...
```

### JWT Based Authorization

Ballerina uses scope based authorization. The JWT can include scopes available for the user. The scopes can then be validated in the Ballerina service. For example, the following service will only allow invocations, if 'hello' scope is available for the user.

Note that the `authConfig` attribute of the `@http:ServiceConfig` annotation has been modified to enforce the authorization check.

```ballerina
import ballerina/http;

http:AuthProvider jwtAuthProvider = {
   scheme:"jwt",
   issuer:"ballerina",
   audience: "ballerina.io",
   clockSkew:10,
   certificateAlias: "ballerina",
   trustStore: {
       path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
       password: "ballerina"
   }
};

endpoint http:SecureListener secureHelloWorldEp {
   port:9091,
   authProviders:[jwtAuthProvider],
   secureSocket: {
       keyStore: {
           path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};

@http:ServiceConfig {
   basePath:"/hello",
   authConfig:{
      scopes:["hello"]
   }
}
service<http:Service> helloWorld bind secureHelloWorldEp {

   @http:ResourceConfig {
       methods:["GET"],
       path:"/"
   }
   sayHello (endpoint caller, http:Request req) {
       http:Response resp = new;
       resp.setTextPayload("Hello, World!");
       _ = caller->respond(resp);
   }
}
```

When the service is invoked without the expected scope, an authorization failure will occur:

```
curl -k -v -H "Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdW
IiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyN
DU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFs
bGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdfQ.X2mHWCr8A5UaJFvjSPUammAC
nTzFsTdre-P5yWQgrwLBmfcpr9JaUuq4sEwp6to3xSKN7u9QKqRLuWH1SlcphDQn6kdF1ZrCgXRQ0HQ
TilZQU1hllZ4c7yMNtMgMIaPgEBrStLX1Ufr6LpDkTA4VeaPCSqstHt9WbRzIoPQ1fCxjvHBP17ShiG
PRza9p_Z4t897s40aQMKbKLqLQ8rEaYAcsoRBXYyUhb_PRS-YZtIdo7iVmkMVFjYjHvmYbpYhNo57Z1
Y5dNa8h8-4ON4CXzcJ1RzuyuFVz1a3YL3gWTsiliVmno7vKyRo8utirDRIPi0dPJPuWi2uMtJkqdkpz
JQ" https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJ
pbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwian
RpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiY
mFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdfQ.X2mHWCr8A5UaJFvjSPUammACnTzFsTdre-P5y
WQgrwLBmfcpr9JaUuq4sEwp6to3xSKN7u9QKqRLuWH1SlcphDQn6kdF1ZrCgXRQ0HQTilZQU1hllZ4c
7yMNtMgMIaPgEBrStLX1Ufr6LpDkTA4VeaPCSqstHt9WbRzIoPQ1fCxjvHBP17ShiGPRza9p_Z4t897
s40aQMKbKLqLQ8rEaYAcsoRBXYyUhb_PRS-YZtIdo7iVmkMVFjYjHvmYbpYhNo57Z1Y5dNa8h8-4ON4
CXzcJ1RzuyuFVz1a3YL3gWTsiliVmno7vKyRo8utirDRIPi0dPJPuWi2uMtJkqdkpzJQ
>

< HTTP/1.1 403 Forbidden
< content-type: text/plain
< content-length: 37
< server: ballerina/0.970.0-beta14-SNAPSHOT
< date: Tue, 24 Apr 2018 20:19:05 +0530
<
request failed: Authorization failure
```

Request with correct scope attribute included will result in a successful invocation. An example of a JWT that has the correct scope attribute is as follows.

```
{
  "sub": "ballerina",
  "iss": "ballerina",
  "exp": 2818415019,
  "iat": 1524575019,
  "jti": "f5aded50585c46f2b8ca233d0c2a3c9d",
  "aud": [
    "ballerina",
    "ballerina.org",
    "ballerina.io"
  ],
  "scope": "hello"
}
```

```
curl -k -v -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzd
WIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUy
NDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmF
sbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bN
oqz9_DzgeKSK6ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZw
C3glAmRBrl4BYCbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOi
n1R3lJCPspJ2ey_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSw
Kw5ZoVJrCUiNG5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvc
abuid80lnrs2-mAEcstgiHVw' https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZX
JpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwia
nRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwi
YmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bNoqz9_DzgeKSK6
ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZwC3glAmRBrl4BY
CbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOin1R3lJCPspJ2e
y_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSwKw5ZoVJrCUiNG
5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvcabuid80lnrs2-
mAEcstgiHVw
>

< HTTP/1.1 200 OK
< content-type: text/plain
< content-length: 13
< server: ballerina/0.970.0-beta14-SNAPSHOT
< date: Tue, 24 Apr 2018 20:22:08 +0530
<
Hello, World!
```

Note that the scopes defined in `@http:ServiceConfig` can also be overridden in `@http:ResourceConfig`.

```
@http:ResourceConfig {
   methods:["GET"],
   path:"/",
   authConfig:{
      scopes:["say-hello"]
   }
}
sayHello (endpoint caller, http:Request req) {
// ...
```

### Basic Authentication and Authorization

Ballerina supports Basic Authentication for services. The `scheme` field of `http:AuthProvider` should be set to basic in order to enforce Basic Authentication. Since user information is provided using a configuration file `authStoreProvider` should be set to `config`.

```ballerina
import ballerina/http;

http:AuthProvider basicAuthProvider = {
   scheme:"basic",
   authStoreProvider:"config"
};

endpoint http:SecureListener secureHelloWorldEp {
   port:9091,
   authProviders:[basicAuthProvider],
   secureSocket: {
       keyStore: {
           path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};

@http:ServiceConfig {
   basePath:"/hello",
   authConfig:{
      scopes:["hello"]
   }
}
service<http:Service> helloWorld bind secureHelloWorldEp {

   @http:ResourceConfig {
       methods:["GET"],
       path:"/"
   }
   sayHello (endpoint caller, http:Request req) {
       http:Response resp = new;
       resp.setTextPayload("Hello, World!");
       _ = caller->respond(resp);
   }
}
```

To enforce Basic Authentication, users and scopes should be configured through a configuration file. The following example file introduces two users. The 'generalUser' has no scopes and the 'admin' user has the 'hello' scope.

**sample-users.toml**
```
["b7a.users"]

["b7a.users.generalUser"]
password="@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}"

["b7a.users.admin"]
password="@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}"
scopes="hello"
```

Restart the service using the following command.

```
ballerina run --config sample-users.toml basic_auth_sample.bal
```

Since passwords are encrypted, the Config API will request for the decryption key. Use 'ballerina' as the decryption key in this sample.

Once service is restarted with the configuration file in place, 'generalUser' will not be able to invoke the service due to authorization failure:

```
curl -k -v -u generalUser:password https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*

< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< content-length: 38
< server: ballerina/0.970.0-beta6-SNAPSHOT
< date: Mon, 23 Apr 2018 11:00:31 +0530
<
request failed: Authorization failure
```

'Admin' user will be able to invoke the service:

```
curl -k -v -u admin:password https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*

< HTTP/1.1 200 OK
< content-type: text/plain
< content-length: 13
< server: ballerina/0.970.0-beta14-SNAPSHOT
< date: Mon, 23 Apr 2018 11:00:31 +0530
<
Hello, World!
```

### Authenticating with Downstream Services

Ballerina client connectors can be configured to include authentication and authorization information with requests sent to external or downstream services. Downstream services can be authenticated using JWT, OAuth2, or Basic Authentication.

#### JWT Based Client Authentication

`http:Client` endpoint can be configured to include JWT token as follows:

```ballerina
import ballerina/http;

http:AuthProvider jwtAuthProvider = {
   scheme:"jwt",
   propagateToken: true,
   issuer:"ballerina",
   audience: "ballerina.io",
   clockSkew:10,
   certificateAlias: "ballerina",
   trustStore: {
       path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
       password: "ballerina"
   }
};

endpoint http:SecureListener secureHelloWorldEp {
   port:9091,
   authProviders:[jwtAuthProvider],
   secureSocket: {
       keyStore: {
           path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};

endpoint http:Client downstreamServiceEP {
   url: "https://localhost:9092",
   auth: { scheme: http:JWT_AUTH },
   secureSocket: {
       trustStore: {
           path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
           password: "ballerina"
       }
   }
};

@http:ServiceConfig {
   basePath:"/hello",
   authConfig:{
      scopes:["hello"]
   }
}
service<http:Service> helloWorld bind secureHelloWorldEp {

   @http:ResourceConfig {
       methods:["GET"],
       path:"/"
   }
   sayHello (endpoint caller, http:Request req) {
       http:Response response = check downstreamServiceEP->get("/update-stats",
                                                         message = untaint req);
       _ = caller->respond(response);
   }
}

// ----------------------------------------------
// Following code creates the downstream service
// ----------------------------------------------

http:AuthProvider downstreamJwtAuthProvider = {
   scheme:"jwt",
   issuer:"ballerina",
   audience: "ballerina.io",
   clockSkew:10,
   certificateAlias: "ballerina",
   trustStore: {
       path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
       password: "ballerina"
   }
};

endpoint http:SecureListener secureUpdateServiceEp {
   port:9092,
   authProviders:[downstreamJwtAuthProvider],
   secureSocket: {
       keyStore: {
           path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};

@http:ServiceConfig {
   basePath:"/update-stats"
}
service<http:Service> updateService bind secureUpdateServiceEp {

   @http:ResourceConfig {
       methods:["GET"],
       path:"/"
   }
   updateStats (endpoint caller, http:Request req) {
       http:Response resp = new;
       resp.setTextPayload("Downstream Service Received JWT: " +
                           untaint req.getHeader("Authorization"));
       _ = caller->respond(resp);
   }
}
```

Invoking `/hello` resource of the service will result in invoking the downstream service exposed through port `9092` with the JWT. The response generated by the downstream services confirms that it received the JWT:

```
curl -k -v -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzd
WIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUy
NDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmF
sbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bN
oqz9_DzgeKSK6ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZw
C3glAmRBrl4BYCbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOi
n1R3lJCPspJ2ey_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSw
Kw5ZoVJrCUiNG5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvc
abuid80lnrs2-mAEcstgiHVw' https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.60.0
> Accept: */*
> Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZX
JpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwia
nRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwi
YmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bNoqz9_DzgeKSK6
ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZwC3glAmRBrl4BY
CbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOin1R3lJCPspJ2e
y_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSwKw5ZoVJrCUiNG
5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvcabuid80lnrs2-
mAEcstgiHVw

< HTTP/1.1 200 OK
< content-type: text/plain
< date: Wed, 20 Jun 2018 15:39:09 +0530
< server: wso2-http-transport
< content-length: 659
<
Downstream Service Received JWT: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.ey
JzdWIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6M
TUyNDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsi
YmFsbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0
.bNoqz9_DzgeKSK6ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJ
vZwC3glAmRBrl4BYCbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnf
hOin1R3lJCPspJ2ey_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNO
BSwKw5ZoVJrCUiNG5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLi
Hvcabuid80lnrs2-mAEcstgiHVw
```

Even if the current service is configured to use Basic Authentication, Ballerina can be configured to internally generate a new JWT when calling external or downstream services. To do so, it is required to add JWT issuer configuration to the `basicAuthProvider`, and enable JWT token propagation using `propagateToken` configuration:

```ballerina
import ballerina/http;

http:AuthProvider basicAuthProvider = {
   scheme:"basic",
   authStoreProvider:"config",
   propagateToken: true,
   issuer:"ballerina",
   audience:"ballerina.io",
   keyAlias:"ballerina",
   keyPassword:"ballerina",
   keyStore:
   {
      path:"${ballerina.home}/bre/security/ballerinaKeystore.p12",
      password:"ballerina"
   }

};

endpoint http:SecureListener secureHelloWorldEp {
   port:9091,
   authProviders:[basicAuthProvider],
   secureSocket: {
       keyStore: {
           path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};

endpoint http:Client downstreamServiceEP {
   url: "https://localhost:9092",
   auth: { scheme: http:JWT_AUTH },
   secureSocket: {
       trustStore: {
           path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
           password: "ballerina"
       }
   }
};

@http:ServiceConfig {
   basePath:"/hello",
   authConfig:{
      scopes:["hello"]
   }
}
service<http:Service> helloWorld bind secureHelloWorldEp {

   @http:ResourceConfig {
       methods:["GET"],
       path:"/"
   }
   sayHello (endpoint caller, http:Request req) {
       http:Response response = check downstreamServiceEP->get("/update-stats",
                                                         message = untaint req);
       _ = caller->respond(response);
   }
}

// ----------------------------------------------
// Following code creates the downstream service
// ----------------------------------------------

http:AuthProvider jwtAuthProvider = {
   scheme:"jwt",
   issuer:"ballerina",
   audience: "ballerina.io",
   clockSkew:10,
   certificateAlias: "ballerina",
   trustStore: {
       path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
       password: "ballerina"
   }
};

endpoint http:SecureListener secureUpdateServiceEp {
   port:9092,
   authProviders:[jwtAuthProvider],
   secureSocket: {
       keyStore: {
           path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
           password: "ballerina"
       }
   }
};

@http:ServiceConfig {
   basePath:"/update-stats"
}
service<http:Service> updateService bind secureUpdateServiceEp {

   @http:ResourceConfig {
       methods:["GET"],
       path:"/"
   }
   updateStats (endpoint caller, http:Request req) {
       http:Response resp = new;
       resp.setTextPayload("Downstream Service Received JWT: " +
                           untaint req.getHeader("Authorization"));
       _ = caller->respond(resp);
   }
}
```

Start the service using the following command after creating `sample-users.toml` with the set of valid users.

```
ballerina run --config sample-users.toml basic_auth_sample.bal
```

Use 'ballerina' as the password to decrypt user passwords, if you are using the `sample-users.toml` file provided in this page.

'Admin' user will be able to invoke the `/hello` resource and invoke the JWT protected downstream service:

```
curl -k -v -u admin:password https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> Authorization: Basic YWRtaW46cGFzc3dvcmQ=
> User-Agent: curl/7.60.0
> Accept: */*

< HTTP/1.1 200 OK
< content-type: text/plain
< date: Wed, 20 Jun 2018 16:07:09 +0530
< server: wso2-http-transport
< content-length: 602
<
Downstream Service Received JWT: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.ey
JzdWIiOiJhZG1pbiIsImlzcyI6ImJhbGxlcmluYSIsImV4cCI6MTUyOTQ5MTMyOCwiaWF0IjoxNTI5N
DkxMDI4LCJqdGkiOiI2NDZkZThlYi02Y2QzLTQ3ODUtYmFiYS1lNGI2YWZjZGMyM2MiLCJhdWQiOlsi
YmFsbGVyaW5hLmlvIl19.OBjpINzO63aUZ1brLN4MnNY7AE_yfuFlKaueJtT47__Pknr7A8nimf6DIX
3MtdaK1FAEE02ivlRpS-gtYxARBXyaKZYOxVMLo08px6E6zS5t1KGi6WnSWNE4OtvU13mzGir4S6eKe
rUHiXM8p8EzfCqDU2Nip6PJdCZPwdTr24D8rtMxOdT3-qTj4C6GT3j8TRK6AFGYLcvog2N-5jQVjonV
lWAY-f9UKjjOvsy4h4fvQ-fxwhL6T9WVLruIAXM9mTF4u5WXvMwoid3TNIuyvdFuJaWyVp572hYyGMX
kj_9tUurTgQAw46GyeGeWMENr-JDHSNs1ZV4fbdH_EUlM6Q==
```

#### OAuth2 Based Client Authentication

`http:Client` endpoint can be configured to include OAuth2 credentials. This can be done by providing access token and refresh token information:

```ballerina
endpoint http:Client downstreamServiceEP {
   url: "https://localhost:9092",
   auth: {
      scheme: http:OAUTH2,
      accessToken: "34060588-dd4e-36a5-ad93-440cc77a1cfb",
      refreshToken: "15160398-ae07-71b1-aea1-411ece712e59",
      refreshUrl: "https://ballerina.io/sample/refresh",
      clientId: "rgfKVdnMQnJSSr_pKFTxj3apiwYa",
      clientSecret: "BRebJ0aqfclQB9v7yZwhj0JfW0ga"
   },
   secureSocket: {
       trustStore: {
           path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
           password: "ballerina"
       }
   }
};
```

#### Basic Authentication Based Client Authentication

`http:Client` endpoint can be configured to include Basic Authentication credentials:

```ballerina
endpoint http:Client downstreamServiceEP {
   url: "https://localhost:9092",
   auth: {
      scheme: http:BASIC_AUTH,
      username: "downstreamServiceUser",
      password: "password"
   },
   secureSocket: {
       trustStore: {
           path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
           password: "ballerina"
       }
   }
};
```
