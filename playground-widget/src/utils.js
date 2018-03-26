

const isProduction = process.env.NODE_ENV === 'production';

const HOST =  isProduction 
                    ? BACKEND_HOST
                    : 'localhost:9091';

const LAUNCHER_URL = `ws${isProduction ? 's' : ''}://${HOST}/composer/ballerina/launcher`;
const PARSER_URL = `http${isProduction ? 's' : ''}://${HOST}/composer/ballerina/parser/file/validate-and-parse`;

export function getLauncherURL() {
    return LAUNCHER_URL;
}

export function getParserURL() {
    return PARSER_URL;
}