

const isProduction = process.env.NODE_ENV === 'production';

const HOST =  isProduction 
                    ? BACKEND_HOST
                    : 'localhost:8080';

const LAUNCHER_URL = `ws${isProduction ? 's' : ''}://${HOST}/api/run`;
const PARSER_URL = `http${isProduction ? 's' : ''}://${HOST}/api/parse`;

export function getLauncherURL() {
    return LAUNCHER_URL;
}

export function getParserURL() {
    return PARSER_URL;
}