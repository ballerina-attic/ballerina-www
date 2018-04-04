

const isProduction = process.env.NODE_ENV === 'production';

const HOST =  isProduction 
                    ? BACKEND_HOST
                    : 'localhost:9443';

const LAUNCHER_URL = `wss://${HOST}/api/run`;
const PARSER_URL = `https://${HOST}/composer/ballerina/parser/file/validate-and-parse`;

export function getLauncherURL() {
    return LAUNCHER_URL;
}

export function getParserURL() {
    return PARSER_URL;
}