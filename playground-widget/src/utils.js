const ORIGIN =  BACKEND_HOST 
                    ? BACKEND_HOST
                    : window.location.hostname + (window.location.port ? ':' + window.location.port: '');

const LAUNCHER_URL = `ws://${ORIGIN}/composer/ballerina/launcher`;
const PARSER_URL = `http://${ORIGIN}/composer/ballerina/parser/file/validate-and-parse`;

export function getLauncherURL() {
    return LAUNCHER_URL;
}

export function getParserURL() {
    return PARSER_URL;
}