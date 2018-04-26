# How to Write Secure Ballerina Programs 

This document demonstrates different security features and controls available within Ballerina, and serves the purpose of providing guidelines on writing secure Ballerina programs. 

## Secure by Design

Unlike any other programming language, Ballerina is designed to make sure programs written with Ballerina are inherently secure. Due to this, it is unnecessary to provide a complicated list of best practices that should be followed to avoid security vulnerabilities. Instead, the Ballerina language compiler takes care of making sure that the Ballerina program does not introduce security vulnerabilities. A comprehensive taint analysis mechanism is used to achieve this.

Whenever you come across a compiler error similar to the following, Ballerina prevents you from introducing a security vulnerability, by passing untrusted data to a security sensitive parameter:

```
tainted value passed to sensitive parameter 'sqlQuery'
```

In order to mitigate the identified security risk, you should perform proper validation or sanitization of untrusted data and explicitly mark such data trusted.

Ballerina standard library makes sure untrusted data cannot be used with security sensitive parameters such as file name, file paths, permission flags, SQL queries, request URLs and configuration keys, resulting in Ballerina programs being inherently resilient to major security vulnerabilities, including: 

* SQL Injection
* Path Manipulation
* File Manipulation
* Unauthorized File Access
* Unvalidated Redirect (Open Redirect)

### Ensuring security of Ballerina standard libraries
Security sensitive functions and actions of Ballerina standard libraries will carry "@sensitive" parameter annotation that denotes untrusted (tainted) data should not be passed to the parameter. One example of such parameter is the "sqlQuery" parameter of the SQL client connector actions.

```ballerina
@Description {value:"The select action implementation for SQL connector to select data from tables."}
@Param {value:"sqlQuery: SQL query to execute"}
@Param {value:"parameters: Parameter array used with the SQL query"}
@Return {value:"Result set for the given query"}
@Return {value:"The Error occured during SQL client invocation"} 
public native function select (@sensitive string sqlQuery, (Parameter[] | ()) parameters,
   (typedesc | ()) recordType) returns @tainted (table | error);
```

Since "sqlQuery" has been marked security sensitive, a user will not be able to pass tainted data as the SQL query, which would otherwise lead to SQL injection vulnerabilities. 

Consider the following example that constructs the SQL query based on user provided, tainted argument: 

```ballerina
import ballerina/mysql;

endpoint mysql:Client testDB {
   host: "localhost",
   port: 3306
};

public function main (string[] args) {
   // Construct student ID based on user input.
   string studentId = "S_" + args[0];

   // Execute select query using the untrusted (tainted) student ID
   var dt = testDB -> select("SELECT  NAME FROM STUDENT WHERE ID = " + studentId, null, null);
   var closeStatus = testDB -> close();
   return;
}
```

Ballerina compiler will generate the following error when attempting to compile this code. 

```
tainted value passed to sensitive parameter 'sqlQuery'
```

In order to get the program to compile, it is required to make use of query parameters: 

```ballerina
   sql:Parameter paramId = { sqlType:sql: TYPE_VARCHAR, value: studentId };
   sql:Parameter[] parameters = [ paramId ];
   var dt = testDB -> select("SELECT  NAME FROM STUDENT WHERE ID = ?", parameters, null);
```

Command-line arguments to Ballerina programs and inputs received through service resources are considered tainted. Additionally, return values of certain functions and actions are marked with "@tainted" annotation to denote that the resulting value should be considered as untrusted data.

For example, the "select" action of the SQL client connector highlighted above returns a "@tainted table", which means any value read from a database is considered untrusted.

### Securely using tainted data with security sensitive parameters

There can be certain situations where a tainted value must be passed into a security sensitive parameter. In such situations, it is essential to do proper data validation or data sanitization to make sure input does not result in a security threat. Once proper controls are in place, "untaint" unary expression can be used to denote that the proceeding value is trusted:

```ballerina
// Execute select query using the untrusted (tainted) student ID
boolean isValid = isNumeric(studentId);
if (isValid) {
   var dt = testDB -> select("SELECT  NAME FROM STUDENT WHERE ID = " + untaint studentId, null, null);
}
// ...
```

Additionally, return values can be annotated with "@untainted" annotation to denote that the return value should be considered trusted (even though return value is derived from tainted data):

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
Ballerina provides an API for accessing configuration values from different sources. Please refer to the Config API example for more details. 

When a configuration value contains a password or a secret, such value should be encrypted for additional protection. Ballerina Config API can automatically decrypt encrypted configuration values. Please refer to "Securing Configuration Values" guide for more details. 

## Authentication and Authorization 
Ballerina service can be configured to enforce authentication and authorization checks. In situations where a service should have controlled access, follow the "Securing RESTful Services" guide to enforce required checks. If you are working with JWT based authentication and authorization, follow the "API Gateway" [TODO: Add link] guide.

