# Publish a Package

Pushing a package uploads the package to
Ballerina Central (https://central.ballerina.io/) repository.

```
ballerina push <package-name>
```

Before you push, you must enter your Ballerina Central access token in
`Settings.toml` in your home repository (`<USER_HOME>/.ballerina/`).
To get your token, register on Ballerina Central and visit the user dashboard
at https://central.ballerina.io/dashboard.


If you are connected to the internet via a http proxy, add the following
section to `Settings.toml` and change accordingly.

```
[proxy]
host = "localhost"
port = "3128"
username = ""
password = ""
```

When you push a package to Ballerina Central, the runtime will validate
organizations for the user against the org-name defined in your package’s
`Ballerina.toml` file. Therefore, when you have more than one organization in
Ballerina Central, be sure to pick the organization name that you intend to
push the package into and set that as org-name in `Ballerina.toml` inside
the project directory.
