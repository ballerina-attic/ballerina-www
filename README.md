# ballerina-www

## setting up for development

1. `git clone https://github.com/ballerina-platform/ballerina-www.git`
2. `git submodule update --init --recursive`
3. `mvn clean install`

## starting widget in development server

1. `cd playground-widget/ballerina/composer/modules/web && npm install` (we need this ATM as babel tries to load babel plugins from ballerina/composer/modules/web/node_modules for js files from composer)

2. `cd playground-widget && npm run start`