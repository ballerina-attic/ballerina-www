

const isProduction = process.env.NODE_ENV === 'production';

const HOST =  isProduction 
                    ? BACKEND_HOST
                    : 'localhost:8080';

export const FETCH_LAUNCHER_API = 'https://controller.playground.preprod.ballerina.io/api/launcher';
export const RUN_API_URL = `ws${isProduction ? 's' : ''}://${HOST}/api/run`;
export const PARSER_API_URL = `https://parser.playground.preprod.ballerina.io/api/parser`;