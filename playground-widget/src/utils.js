const HOST =  BACKEND_HOST 
                    ? BACKEND_HOST
                    : window.location.hostname;

const LAUNCHER_URL = `wss://${HOST}:${WS_PORT}/composer/ballerina/launcher`;
const PARSER_URL = `https://${HOST}:${HTTPS_PORT}/composer/ballerina/parser/file/validate-and-parse`;

export function getLauncherURL() {
    return LAUNCHER_URL;
}

export function getParserURL() {
    return PARSER_URL;
}