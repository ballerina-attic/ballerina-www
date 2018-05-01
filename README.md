# ballerina-www

## setting up for development

### prerequisite

* [Maven](https://maven.apache.org/download.cgi)
* [Node (v8.9.x or latest LTS release) + npm (v5.6.0 or later)](https://nodejs.org/en/download/)
* [Go] (https://golang.org/)
* [Python] (https://www.python.org/)
* [MKDocs] (http://www.mkdocs.org/)
* [BeautifulSoup4] (https://www.crummy.com/software/BeautifulSoup/)
* [lxml] (http://lxml.de/)

### building

1. `git clone https://github.com/ballerina-platform/ballerina-www.git`
2. `git submodule update --init --recursive`
3. `mvn clean install`

### starting widget in development server

After following below steps, webpack will host playground widget at http://localhost:3000 and changes done to source files will be hot deployed.

1. `cd playground-widget/ballerina/composer/modules/web && npm install` (we need this ATM as babel tries to load babel plugins from ballerina/composer/modules/web/node_modules for js files from composer)

2. `cd playground-widget && npm run start`
