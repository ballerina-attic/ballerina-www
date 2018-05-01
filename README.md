# ballerina-www

## setting up for development

### prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Node (v8.9.x or latest LTS release) + npm (v5.6.0 or later)](https://nodejs.org/en/download/)
* [Go](https://golang.org/)
* [Python](https://www.python.org/)
* [MKDocs](http://www.mkdocs.org/)
* [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/)
* [lxml](http://lxml.de/)

### building

1. `git clone https://github.com/ballerina-platform/ballerina-www.git`
2. `git submodule update --init --recursive`
3. `mvn clean install`

Once build is completed, you can find the generated www folder at `<repo-root>/website/target/webroot/`. If you already have a webserver, copy this folder to webroot and point the browser to your webserver.

Otherwise, since you already have NodeJs installed, install [serve](https://github.com/zeit/serve) - a simple webserver on NodeJs.

1. To install, execute `npm i -g serve`.
2. To start the server, execute `serve <repo-root>/website/target/webroot/`.

This will start a webserver with `<repo-root>/website/target/webroot/` path set as the webroot and by default can be consumed via `http://localhost:5000`.

### starting widget in development server

After following below steps, webpack will host playground widget at http://localhost:3000 and changes done to source files will be hot deployed.

1. `cd playground-widget/ballerina/composer/modules/web && npm install` (we need this ATM as babel tries to load babel plugins from ballerina/composer/modules/web/node_modules for js files from composer)

2. `cd playground-widget && npm run start`
