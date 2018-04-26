# How to Write Secure Ballerina Programs

This document demonstrates different security features and controls available within Ballerina, and serves the purpose of providing guidelines on writing secure Ballerina programs.

## Secure by Design

This approach makes it unnecessary for developers to review best practice coding lists that itemize how to avoid security vulnerabilities. The Ballerina compiler ensures that Ballerina programs do not introduce security vulnerabilities.

A taint analysis mechanism is used to achieve this.

Parameters in function calls can be designated as security-sensitive. The compiler will generate an error if you pass untrusted data (tainted data) into a security-sensitive parameter:


```
tainted value passed to sensitive parameter 'sqlQuery'
```

We require developers to explicitly mark all values passed into security-sensitive parameters as "trusted". This explicit check forces developers and code reviewers to verify that the values being passed into the parameter are not vulnerable to a security violation.

Ballerina standard library makes sure untrusted data cannot be used with security sensitive parameters such as SQL queries, file paths, file name, permission flags, request URLs and configuration keys, preventing  vulnerabilities, including:

* SQL Injection
* Path Manipulation
* File Manipulation
* Unauthorized File Access
* Unvalidated Redirect (Open Redirect)

### Ensuring security of Ballerina standard libraries
Security sensitive functions and actions of Ballerina standard libraries are decorated with  `@sensitive` parameter annotation that denotes untrusted data (tainted data) should not be passed to the parameter. For example, `sqlQuery` parameter of `ballerina/sql`, `select` action.

```ballerina
public native function select (@sensitive string sqlQuery, (typedesc|()) recordType,
                               Parameter... parameters) returns @tainted (table|error);
```

Consider the following example that constructs a SQL query with a tainted argument:

```ballerina
import ballerina/mysql;

endpoint mysql:Client testDB {
   host: "localhost",
   port: 3306
};

type ResultStudent {
    string NAME,
};

function main (string... args) {
   // Construct student ID based on user input.
   string studentId = "S_" + args[0];

   // Execute select query using the untrusted (tainted) student ID
   var dt = testDB -> select("SELECT NAME FROM STUDENT WHERE ID = " + studentId, ResultStudent);
   var closeStatus = testDB -> close();
   return;
}
```

The Ballerina compiler will generate an error:

```
tainted value passed to sensitive parameter 'sqlQuery'
```

In order to compile, the program is modified to use query parameters:

```ballerina
sql:Parameter paramId = ( sql:TYPE_VARCHAR, studentId );
var dt = testDB -> select("SELECT NAME FROM STUDENT WHERE ID = ?", ResultStudent, paramId);
```

Command-line arguments to Ballerina programs and inputs received through service resources are considered tainted. Additionally, return values of certain functions and actions are marked with `@tainted` annotation to denote that the resulting value should be considered as untrusted data.

For example, the select action of the SQL client connector highlighted above returns a `@tainted table`, which means any value read from a database is considered untrusted.

If return was not explicitly annotated, Ballerina will infer the tainted status of the return by analyzing how tainted status of parameters affect tainted status of the return.

### Securely using tainted data with security sensitive parameters

There can be certain situations where a tainted value must be passed into a security sensitive parameter. In such situations, it is essential to do proper data validation or data sanitization to make sure input does not result in a security threat. Once proper controls are in place, `untaint` unary expression can be used to denote that the proceeding value is trusted:

```ballerina
// Execute select query using the untrusted (tainted) student ID
boolean isValid = isNumeric(studentId);
if (isValid) {
   var dt = testDB -> select("SELECT NAME FROM STUDENT WHERE ID = " + untaint studentId, ResultStudent);
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

Ballerina provides an API for accessing configuration values from different sources. Please refer to the Config API Ballerina by Example for details.

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

The file based approach is useful in automated deployments. The file containing the decryption secret can be deployed along with the Ballerina program. The name and the path of the secret file can be configured using the `b7a.config.secret` runtime parameter:

```
ballerina run -eb7a.config.secret=path/to/secret/file securing_configuration_values.balx
```
