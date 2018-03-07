# ballerina-www

## setting up for development

1. `git clone https://github.com/ballerina-platform/ballerina-www.git`
2. `git submodule init`
3. `git submodule update`
4. `cd ballerina/composer/modules/web && npm install` (we need this ATM as babel tries to load babel plugins from ballerina/composer/modules/web/node_modules for js files from composer)

## starting widget in development server

`cd playground-widget && npm run start`