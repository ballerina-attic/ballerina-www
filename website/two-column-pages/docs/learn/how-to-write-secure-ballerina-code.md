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

Security-sensitive functions and actions of Ballerina standard libraries are annotated with the `@sensitive` parameter annotation. This denotes that untrusted (tainted) data should not be passed to the parameter. 

For example, the `sqlQuery` parameter of the `ballerina/sql` `select` remote function is annotated as `@sensitive`.

```ballerina
public remote function select(@sensitive string sqlQuery, typedesc? recordType, 
                              boolean loadToMemory = false, Param... parameters) 
                      returns @tainted table<record {}>|error;
```

The following example constructs an SQL query with a tainted argument:

```ballerina
import ballerina/mysql;

type ResultStudent record {
    string name;
};

public function main() {

    mysql:Client testDB = new({
       host: "localhost",
       port: 3306
    });

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

You need to import the `ballerina/sql` module to use the `sql:Parameter` type.

Command-line arguments passed to Ballerina programs and inputs received through service resources are considered tainted. Additionally, return values of certain functions and actions are marked with the `@tainted` annotation to denote that the resulting value should be considered as untrusted data.

For example, the `select` remote function of the SQL client connector highlighted above returns a `@tainted table<record {}>`. This means that any value read from a database is considered as untrusted.

If the return type is not explicitly annotated, Ballerina will infer the tainted status of the return value. This is done by analyzing how the tainted status of parameters affect the same of the return value.

### Securely using tainted data with security-sensitive parameters

There can be certain situations where a tainted value must be passed into a security-sensitive parameter. In such situations, it is essential to do proper data validation or data sanitization to make sure the input does not result in a security threat. Once proper controls are in place, the `untaint` unary expression can be used to denote that the value is trusted:

```ballerina
// Execute select query using the untrusted (tainted) student ID
boolean isValid = isNumeric(studentId);
if (isValid) {
   var dt = testDB->select("SELECT NAME FROM STUDENT WHERE ID = " +
                           untaint studentId, ResultStudent);
}
// ...
```

Additionally, return values can be annotated as `@untainted`. This denotes that the return value should be trusted (even if the return value is derived from tainted data):

```ballerina
// Execute the select query using the untrusted (tainted) student ID
function sanitizeSortColumn (string columnName) returns @untainted string {
   string sanitizedSortColumn = columnName;
   // Insert sanitization logic to ensure that the return value is safe.
   return sanitizedSortColumn;
}
// ...
```

## Securing Passwords and Secrets

Ballerina provides an API to access configuration values from different sources. For more information, see [Config Ballerina by Example](https://ballerina.io/learn/by-example/config-api.html).

Configuration values containing passwords or secrets should be encrypted. The Ballerina Config API will decrypt such configuration values when being accessed.

Use the following command to encrypt a configuration value:

```cmd
$ ballerina encrypt
```

The encrypt command will prompt for the plain-text value to be encrypted and an encryption secret.

```cmd
$ ballerina encrypt
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

### Inbound Authentication & Authorization

Ballerina inbound authentication is abstracted out into 2 layers called `http:InboundAuthHandler` and `auth:InboundAuthProvider`.
The `http:InboundAuthHandler` is used to perform HTTP level actions which are extracting the required HTTP header and extracting the credential out of it and passing into associated `auth:InboundAuthProvider` and get the credential validated. The `auth:InboundAuthProvider` is used to validate the credential passed by the `http:InboundAuthHandler`.

Ballerina supports Basic authentication, JWT authentication, OAuth2 authentication and LDAP authentication. Ballerina HTTP services can be configured to enforce authentication and authorization.

A user can implement a custom version of AuthHandler with the use of object equivalency pattern as follows:
```ballerina
public type InboundCustomAuthHandler object {

    *http:InboundAuthHandler;

    public function process(http:Request req) returns boolean|http:AuthenticationError {
        // Custom logic
    }

    public function canProcess(http:Request req) returns @tainted boolean {
        // Custom logic
    }
};
```

A user can implement a custom version of AuthProvider with the use of object equivalency pattern as follows:
```ballerina
public type InboundCustomAuthProvider object {

    *auth:InboundAuthProvider;

    public function authenticate(string credential) returns boolean|auth:Error {
        // Custom logic
    }
};
```

_Note: It is a must to use HTTPS when enforcing authentication and authorization checks, to ensure the confidentiality of sensitive authentication data._

#### Sample Configurations

In a particular authentication scheme, implemented instance of `auth:InboundAuthProvider` is initialized with required configurations and it is passed to the implemented instance of `http:InboundAuthHandler`.

Next, the implemented instance of  `http:InboundAuthHandler` is passed to the `http:Listener` configuration as follows and the listener is initialized with authentication.

```ballerina
listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [authHandler]
    },
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
service helloWorld on secureHelloWorldEp {
// ....
```

Also, the `authHandlers` can be configured for advanced use cases as follows:

Auth should be successful for `authHandler1` OR `authHandler1`.
`authHandlers: [authHandler1, authHandler2]`

Auth should be successful for `authHandler1` AND `authHandler12`.
`authHandlers: [[authHandler1], [authHandler2]]`

Auth should be successful for ((`authHandler1` OR `authHandler2`) AND (`authHandler3` OR `authHandler4`)).
`authHandlers: [[authHandler1, authHandler2], [authHandler3, authHandler4]]`

Optionally `scopes` attribute is configured for the authorization as follows. If it is not specified, that means service is authorized to any user who is authenticated.

```ballerina
listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [authHandler],
        scopes: ["read"]
    },
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});
service helloWorld on secureHelloWorldEp {
// ....
```

Also, the `scopes` can be configured for advanced use cases as follows:

Auth should be successful for `scope-1` OR `scope-2`.
`scopes: ["scopes-1", "scopes-2"]`

Auth should be successful for `scope-1` AND `scope-2`.
`scopes: [["scopes-1"], ["scopes-2"]]`

Auth should be successful for ((`scope-1` OR `scope-2`) AND (`scope-3` OR `scope-4`)).
`scopes: [["scopes-1", "scopes-2"], ["scopes-3", "scopes-4"]]`

Further, the security enforcements can be customized by the `@http:ServiceConfig` annotation and the `@http:ResourceConfig` annotation.

For example, authentication and authorization can be modified for a particular service as follows by configuring `auth` attribute of `@http:ServiceConfig`.
* authentication can be disabled only for a particular service by using the `enabled` attribute.
* authentication mechanism can be changed for a particular service by using the `authHandlers` attribute.
* authorization scopes can be changed for a particular service by using the `scopes` attribute.

```ballerina
@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        enabled: false,
        authHandlers: [authHandlerA],
        scopes: ["scope-A"]
    }
}
service helloWorld on secureHelloWorldEp {
// ...
```

Furthermore, authentication and authorization can be modified for a particular resource as follows by configuring `auth` attribute of `@http:ResourceConfig`:

```ballerina
@http:ResourceConfig {
    basePath: "/",
    auth: {
        enabled: false,
        authHandlers: [authHandlerA],
        scopes: ["scope-A"]
    }
}
resource function sayHello (http:Caller caller, http:Request req) {
// ...
```

The same configuration patterns used for the listener level configuration are applied for `authHandlers` and `scopes` attributes in service level configurations and resource level configurations.

### JWT Authentication and Authorization

Ballerina supports JWT Authentication and Authorizations for services. The `http:BearerAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credential from the header value which is `Bearer <token>`. Then the extracted credential will be passed to the initialized AuthProvider and get validated. The `jwt:InboundJwtAuthProvider` is used to validate the credential (JWT) passed by the AuthHandler against the `jwt:JwtValidatorConfig` provided by the user.

JWT validation requires several additional configurations for `jwt:JwtValidatorConfig` including:

* `issuer` - The issuer of the JWT.
* `audience` - The audience value for the current service.
* `clockSkewInSeconds` - Clock skew in seconds that can be used to avoid token validation failures due to clock synchronization problems.
* `trustStore` - A trust store containing trusted public key certificates of issuers (used for signature validation).
* `certificateAlias` - Alias of the public key certificate.
* `validateCertificate` - Validate public key certificate notBefore and notAfter periods.
* `jwtCache` - Cache used to store parsed JWT information as CachedJwt.

`jwt:JwtValidatorConfig` record should be provided into `jwt:InboundJwtAuthProvider` when initializing and the initialized `jwt:InboundJwtAuthProvider` is passed to the `http:BearerAuthHandler` when initializing.

_Note: For demonstration purposes we use `ballerinaTruststore.p12` included with Ballerina runtime. In a production deployment, the truststore should only contain the public key certificates of the trusted JWT issuers._

```ballerina
import ballerina/http;
import ballerina/jwt;

jwt:InboundJwtAuthProvider jwtAuthProvider = new({
    issuer: "ballerina",
    audience: ["ballerina.io"],
    certificateAlias: "ballerina",
    trustStore: {
        path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
        password: "ballerina"
    }
});
http:BearerAuthHandler jwtAuthHandler = new(jwtAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [jwtAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello"
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< 
Authentication failure
```

Once a request is made with a valid, signed JWT, but without the expected "scope", an authorization failure will occur. An example of a JWT without "scope" attribute is as follows.

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

```
curl -k -v https://localhost:9091/hello -H "Authorization:Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdfQ.X2mHWCr8A5UaJFvjSPUammACnTzFsTdre-P5yWQgrwLBmfcpr9JaUuq4sEwp6to3xSKN7u9QKqRLuWH1SlcphDQn6kdF1ZrCgXRQ0HQTilZQU1hllZ4c7yMNtMgMIaPgEBrStLX1Ufr6LpDkTA4VeaPCSqstHt9WbRzIoPQ1fCxjvHBP17ShiGPRza9p_Z4t897s40aQMKbKLqLQ8rEaYAcsoRBXYyUhb_PRS-YZtIdo7iVmkMVFjYjHvmYbpYhNo57Z1Y5dNa8h8-4ON4CXzcJ1RzuyuFVz1a3YL3gWTsiliVmno7vKyRo8utirDRIPi0dPJPuWi2uMtJkqdkpzJQ"

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
<
Authorization failure
```

A request with a correct "scope" attribute will result in a successful invocation. An example of a JWT that has the correct "scope" attribute is as follows.

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
curl -k -v https://localhost:9091/hello -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bNoqz9_DzgeKSK6ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZwC3glAmRBrl4BYCbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOin1R3lJCPspJ2ey_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSwKw5ZoVJrCUiNG5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvcabuid80lnrs2-mAEcstgiHVw'

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
<
Hello, World!
```

### OAuth2 Authentication and Authorization

Ballerina supports OAuth2 Authentication and Authorizations for services. The `http:BearerAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credential from the header value which is `Bearer <token>`. Then the extracted credential will be passed to the initialized AuthProvider and get validated. The `oauth2:InboundOAuth2Provider` is used to validate the credential passed by the AuthHandler against the introspection endpoint configured at `oauth2:IntrospectionServerConfig`, which is provided by the user.

OAuth2 token validation requires several additional configurations for `oauth2:IntrospectionServerConfig` including:

* `url` - URL of the introspection server.
* `tokenTypeHint` - A hint about the type of the token submitted for introspection.
* `clientConfig` - HTTP client configurations which calls the introspection server.

`oauth2:IntrospectionServerConfig` record should be provided into `oauth2:InboundOAuth2Provider` when initializing and the initialized `oauth2:InboundOAuth2Provider` is passed to the `http:BearerAuthHandler` when initializing.

```ballerina
import ballerina/http;
import ballerina/oauth2;

oauth2:InboundOAuth2Provider oauth2Provider = new({
    url: "https://localhost:9196/oauth2/token/introspect",
    tokenTypeHint: "access_token"
});
http:BearerAuthHandler oauth2Handler = new(oauth2Provider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [oAuth2Handler]
    },
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello"
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< 
Authentication failure
```

Once a request is made with a valid, authentication information, but if the introspection endpoint does not response with the "scope" attribute of the response JSON payload or response with the "scope" attribute which are not the expected scopes, an authorization failure will occur.

```
curl -k -v https://localhost:9091/hello -H "Authorization:Bearer <token>"

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization:Bearer <token>
>

< HTTP/1.1 403 Forbidden
< content-type: text/plain
<
Authorization failure
```

A request which gets a successful response from introspection endpoint with a correct "scope" attribute will result in a successful invocation.

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Bearer <token>'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 200 OK
< content-type: text/plain
<
Hello, World!
```

### LDAP Authentication and Authorization

Ballerina supports LDAP Authentication and Authorizations for services. The `http:BasicAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credential from the header value which is `Basic <token>`. Then the extracted credential will be passed to the initialized AuthProvider and get validated. The `ldap:InboundLdapAuthProvider` is used to validate the credential passed by the AuthHandler against the LDAP server configured at `ldap:LdapConnectionConfig`, which is provided by the user.

LDAP token validation requires several additional configurations for `ldap:LdapConnectionConfig` including:

* `domainName` - Unique name to identify the user store.
* `connectionURL` - Connection URL to the LDAP server.
* `connectionName` - The username used to connect to the LDAP server.
* `connectionPassword` - Password for the ConnectionName user.
* `userSearchBase` - DN of the context or object under which the user entries are stored in the LDAP server.
* `userEntryObjectClass` - Object class used to construct user entries.
* `userNameAttribute` - The attribute used for uniquely identifying a user entry.
* `userNameSearchFilter` - Filtering criteria used to search for a particular user entry.
* `userNameListFilter` - Filtering criteria for searching user entries in the LDAP server.
* `groupSearchBase` - DN of the context or object under which the group entries are stored in the LDAP server.
* `groupEntryObjectClass` - Object class used to construct group entries.
* `groupNameAttribute` - The attribute used for uniquely identifying a group entry.
* `groupNameSearchFilter` - Filtering criteria used to search for a particular group entry.
* `groupNameListFilter` - Filtering criteria for searching group entries in the LDAP server.
* `membershipAttribute` - Define the attribute that contains the distinguished names (DN) of user objects that are in a group.
* `userRolesCacheEnabled` -  To indicate whether to cache the role list of a user.
* `connectionPoolingEnabled` - Define whether LDAP connection pooling is enabled.
* `ldapConnectionTimeout` - Timeout in making the initial LDAP connection.
* `readTimeoutInMillis` - The value of this property is the read timeout in milliseconds for LDAP operations.
* `retryAttempts` - Retry the authentication request if a timeout happened.
* `secureClientSocket` - The SSL configurations for the LDAP client socket. This needs to be configured in order to communicate through LDAPs.

`ldap:LdapConnectionConfig` record should be provided into `ldap:InboundLdapAuthProvider` when initializing and the initialized `ldap:InboundLdapAuthProvider` is passed to the `http:BasicAuthHandler` when initializing.

```ballerina
import ballerina/http;
import ballerina/ldap;

ldap:LdapConnectionConfig ldapConfig = {
    domainName: "ballerina.io",
    connectionURL: "ldap://localhost:20100",
    connectionName: "uid=admin,ou=system",
    connectionPassword: "secret",
    userSearchBase: "ou=Users,dc=ballerina,dc=io",
    userEntryObjectClass: "identityPerson",
    userNameAttribute: "uid",
    userNameSearchFilter: "(&(objectClass=person)(uid=?))",
    userNameListFilter: "(objectClass=person)",
    groupSearchBase: ["ou=Groups,dc=ballerina,dc=io"],
    groupEntryObjectClass: "groupOfNames",
    groupNameAttribute: "cn",
    groupNameSearchFilter: "(&(objectClass=groupOfNames)(cn=?))",
    groupNameListFilter: "(objectClass=groupOfNames)",
    membershipAttribute: "member",
    userRolesCacheEnabled: true,
    connectionPoolingEnabled: false,
    ldapConnectionTimeout: 5000,
    readTimeoutInMillis: 60000,
    retryAttempts: 3
};
ldap:InboundLdapAuthProvider ldapAuthProvider = new(ldapConfig, "ldap01");
http:BasicAuthHandler ldapAuthHandler = new(ldapAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [ldapAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

When the service is invoked without authentication information or invalid authentication information, an authentication failure will occur:

```
curl -k -v https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 401 Unauthorized
< content-type: text/plain
< 
Authentication failure
```

Once a request is made with a valid, authentication information, but if the LDAP server response with a empty group list or unexpected scopes, an authorization failure will occur.

```
curl -k -v https://localhost:9091/hello -H "Authorization: Basic <token>"

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization:Bearer <token>
>

< HTTP/1.1 403 Forbidden
< content-type: text/plain
<
Authorization failure
```

A request which gets a successful response from LDAP server for the "scope" request, will result in a successful invocation.

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Basic <token>'

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*
> Authorization: Bearer <token>
>

< HTTP/1.1 200 OK
< content-type: text/plain
<
Hello, World!
```

### Basic Authentication and Authorization

Ballerina supports Basic Authentication and Authorizations for services. The `http:BasicAuthHandler` is used to extract the HTTP `Authorization` header from the request and extract the credential from the header value which is `Basic <token>`. Then the extracted credential will be passed to the initialized AuthProvider and get validated. The `jwt:InboundBasicAuthProvider` is used to read the user information from the configuration file and authenticate the credential passed by the AuthHandler.

```ballerina
import ballerina/auth;
import ballerina/http;

auth:InboundBasicAuthProvider basicAuthProvider = new;
http:BasicAuthHandler basicAuthHandler = new(basicAuthProvider);

listener http:Listener secureHelloWorldEp = new(9091, {
    auth: {
        authHandlers: [basicAuthHandler]
    },
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    auth: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Hello, World!");
        checkpanic caller->respond(resp);
    }
}
```

To enforce Basic Authentication, users and scopes should be configured through a configuration file. The following example file introduces two users. The 'generalUser` has no scopes and the 'admin' user has the 'hello' scope.

**sample-users.toml**
```
[b7a.users]

[b7a.users.generalUser]
password="@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}"

[b7a.users.admin]
password="@encrypted:{pIQrB9YfCQK1eIWH5d6UaZXA3zr+60JxSBcpa2PY7a8=}"
scopes="hello"
```

Restart the service using the following command.

```
ballerina run --config sample-users.toml basic_auth_sample.bal
```

Since passwords are encrypted, the Config API will request for the decryption key. Use 'ballerina' as the decryption key in this sample.

Also, the passwords can be hashed and provided with the configuration file. The following example file introduces three users along with the passwords hashed with `sha256`, `sha384`, and `sha512` hashing algorithms.

**sample-users.toml**
```
[b7a.users]

[b7a.users.userA]
password="@sha256:{cd2eb0837c9b4c962c22d2ff8b5441b7b45805887f051d39bf133b583baf6860}"

[b7a.users.userB]
password="@sha384:{1249e15f035ed34786a328d9fdb2689ab24f7c7b253d1b7f66ed92a679d663dd502d7beda59973e8c91a728b929fc8cd}"

[b7a.users.userC]
password="@sha512:{9057ff1aa9509b2a0af624d687461d2bbeb07e2f37d953b1ce4a9dc921a7f19c45dc35d7c5363b373792add57d0d7dc41596e1c585d6ef7844cdf8ae87af443f}"
```

Once the service is restarted with the first configuration file in place, the 'generalUser' will not be able to invoke the service due to authorization failure:

```
curl -k -v -u generalUser:password https://localhost:9091/hello

> GET /hello HTTP/1.1
> Host: localhost:9091
> User-Agent: curl/7.47.0
> Accept: */*

< HTTP/1.1 403 Forbidden
< content-type: text/plain
<
Authorization failure
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
<
Hello, World!
```

### Authenticating with Downstream Services

Ballerina client connectors can be configured to include authentication and authorization information with requests sent to external or downstream services. Downstream services can be authenticated using JWT, OAuth2, or Basic Authentication.

#### JWT Based Client Authentication

`http:Client` client object can be configured to include JWT token as follows:

```ballerina
import ballerina/http;

http:AuthProvider jwtAuthProvider = {
    scheme: http:JWT_AUTH,
    config: {
        issuer: "ballerina",
        audience: ["ballerina.io"],
        clockSkew: 10,
        certificateAlias: "ballerina",
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
};

listener http:Listener secureHelloWorldEp = new(9091, config = {
        authProviders: [jwtAuthProvider],
        secureSocket: {
            keyStore: {
                path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
                password: "ballerina"
            }
        }
    });

http:Client downstreamServiceEP = new("https://localhost:9092", config = {
    auth: {
        scheme: http:JWT_AUTH
    },
    secureSocket: {
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    authConfig: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) returns error? {
        http:Response response = check downstreamServiceEP->get("/update-stats", message = untaint req);
        checkpanic caller->respond(response);
    }
}

// ----------------------------------------------
// Following code creates the downstream service
// ----------------------------------------------

http:AuthProvider downstreamJwtAuthProvider = {
    scheme: http:JWT_AUTH,
    config: {
        issuer: "ballerina",
        audience: ["ballerina.io"],
        clockSkew: 10,
        certificateAlias: "ballerina",
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
};

listener http:Listener secureUpdateServiceEp = new(9092, config = {
    authProviders: [downstreamJwtAuthProvider],
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/update-stats"
}
service updateService on secureUpdateServiceEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function updateStats(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Downstream Service Received JWT: " + untaint req.getHeader("Authorization"));
        checkpanic caller->respond(resp);
    }
}
```

Invoking `/hello` resource of the service will result in invoking the downstream service exposed through port `9092` with the JWT. The response generated by the downstream services confirms that it received the JWT:

```
curl -k -v https://localhost:9091/hello -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWxsZXJpbmEiLCJpc3MiOiJiYWxsZXJpbmEiLCJleHAiOjI4MTg0MTUwMTksImlhdCI6MTUyNDU3NTAxOSwianRpIjoiZjVhZGVkNTA1ODVjNDZmMmI4Y2EyMzNkMGMyYTNjOWQiLCJhdWQiOlsiYmFsbGVyaW5hIiwiYmFsbGVyaW5hLm9yZyIsImJhbGxlcmluYS5pbyJdLCJzY29wZSI6ImhlbGxvIn0.bNoqz9_DzgeKSK6ru3DnKL7NiNbY32ksXPYrh6Jp0_O3ST7WfXMs9WVkx6Q2TiYukMAGrnMUFrJnrJvZwC3glAmRBrl4BYCbQ0c5mCbgM9qhhCjC1tBA50rjtLAtRW-JTRpCKS0B9_EmlVKfvXPKDLIpM5hnfhOin1R3lJCPspJ2ey_Ho6fDhsKE3DZgssvgPgI9PBItnkipQ3CqqXWhV-RFBkVBEGPDYXTUVGbXhdNOBSwKw5ZoVJrCUiNG5XD0K4sgN9udVTi3EMKNMnVQaq399k6RYPAy3vIhByS6QZtRjOG8X93WJw-9GLiHvcabuid80lnrs2-mAEcstgiHVw'

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

Even if the current service is configured to use Basic Authentication, Ballerina can be configured to internally generate a new JWT when calling external or downstream services. To do so, it is required to add JWT issuer configuration to the client who is calling to the downstream service as `inferredJwtIssuerConfig` configuration:

```ballerina
import ballerina/http;

http:AuthProvider basicAuthProvider = {
    scheme: http:BASIC_AUTH,
    authStoreProvider: http:CONFIG_AUTH_STORE
};

listener http:Listener secureHelloWorldEp = new(9091, config = {
    authProviders: [basicAuthProvider],
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

http:Client downstreamServiceEP = new("https://localhost:9092", config = {
    auth: {
        scheme: http:JWT_AUTH,
        config: {
            inferredJwtIssuerConfig: {
                issuer: "ballerina",
                audience: ["ballerina.io"],
                keyAlias: "ballerina",
                keyPassword: "ballerina",
                keyStore: {
                    path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
                    password: "ballerina"
                }
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/hello",
    authConfig: {
        scopes: ["hello"]
    }
}
service helloWorld on secureHelloWorldEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function sayHello(http:Caller caller, http:Request req) returns error? {
        http:Response response = check downstreamServiceEP->get("/update-stats", message = untaint req);
        checkpanic caller->respond(response);
    }
}

// ----------------------------------------------
// Following code creates the downstream service
// ----------------------------------------------

http:AuthProvider jwtAuthProvider = {
    scheme: http:JWT_AUTH,
    config: {
        issuer: "ballerina",
        audience: ["ballerina.io"],
        clockSkew: 10,
        certificateAlias: "ballerina",
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
};

listener http:Listener secureUpdateServiceEp = new(9092, config = {
    authProviders: [jwtAuthProvider],
    secureSocket: {
        keyStore: {
            path: "${ballerina.home}/bre/security/ballerinaKeystore.p12",
            password: "ballerina"
        }
    }
});

@http:ServiceConfig {
    basePath: "/update-stats"
}
service updateService on secureUpdateServiceEp {

    @http:ResourceConfig {
        methods: ["GET"],
        path: "/"
    }
    resource function updateStats(http:Caller caller, http:Request req) {
        http:Response resp = new;
        resp.setTextPayload("Downstream Service Received JWT: " + untaint req.getHeader("Authorization"));
        checkpanic caller->respond(resp);
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

The `http:Client` object can be configured to include the OAuth2-based client authentication with the Password and Client Credentials grant types. Also, with the Direct Token mode, the credentials can be provided manually and after that refreshing is handled internally.

##### Client Credentials Grant Type
```ballerina
http:Client downstreamServiceEP = new("https://localhost:9092", config = {
    auth: {
        scheme: http:OAUTH2,
        config: {
            grantType: http:CLIENT_CREDENTIALS_GRANT,
            config: {
                tokenUrl: "https://localhost:9196/oauth2/token/authorize",
                clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxStwNEW4cfStBEGRxRL68",
                clientSecret: "9205371918321623741",
                scopes: ["token-scope1", "token-scope2"]
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

##### Password Grant Type
```ballerina
http:Client downstreamServiceEP = new("https://localhost:9092", config = {
    auth: {
        scheme: http:OAUTH2,
        config: {
            grantType: http:PASSWORD_GRANT,
            config: {
                tokenUrl: "https://localhost:9196/oauth2/token/authorize",
                username: "johndoe",
                password: "A3ddj3w",
                clientId: "3MVG9YDQS5WtC11paU2WcQjBB3L5w4gz52uriT8ksZ3nUVjKvrfQMrU4uvZohTftxStwNEW4cfStBEGRxRL68",
                clientSecret: "9205371918321623741",
                scopes: ["token-scope1", "token-scope2"],
                refreshConfig: {
                    refreshUrl: "https://localhost:9196/oauth2/token/refresh",
                    scopes: ["token-scope1", "token-scope2"]
                }
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

##### Direct Token Mode
```ballerina
http:Client downstreamServiceEP = new("https://localhost:9092", config = {
    auth: {
        scheme: http:OAUTH2,
        config: {
            grantType: http:DIRECT_TOKEN,
            config: {
                accessToken: "34060588-dd4e-36a5-ad93-440cc77a1cfb",
                refreshConfig: {
                    refreshToken: "15160398-ae07-71b1-aea1-411ece712e59",
                    refreshUrl: "https://ballerina.io/sample/refresh",
                    clientId: "rgfKVdnMQnJSSr_pKFTxj3apiwYa",
                    clientSecret: "BRebJ0aqfclQB9v7yZwhj0JfW0ga"
                }
            }
        }
    },
    secureSocket: {
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```

#### Basic Authentication Based Client Authentication

`http:Client` client object can be configured to include Basic Authentication credentials:

```ballerina
http:Client downstreamServiceEP = new("https://localhost:9092", config = {
    auth: {
        scheme: http:BASIC_AUTH,
        config: {
            username: "downstreamServiceUser",
            password: "password"
        }
    },
    secureSocket: {
        trustStore: {
            path: "${ballerina.home}/bre/security/ballerinaTruststore.p12",
            password: "ballerina"
        }
    }
});
```
