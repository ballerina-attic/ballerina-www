const HOST =  BACKEND_HOST 
                    ? BACKEND_HOST
                    : window.location.hostname;

const useSSL = process.env.NODE_ENV === 'production';

const LAUNCHER_URL = `ws${useSSL ? 's' : ''}://${HOST}:${WS_PORT}/composer/ballerina/launcher`;
const PARSER_URL = `http${useSSL ? 's' : ''}://${HOST}:${HTTP_PORT}/composer/ballerina/parser/file/validate-and-parse`;

export function getLauncherURL() {
    return LAUNCHER_URL;
}

export function getParserURL() {
    return PARSER_URL;
}