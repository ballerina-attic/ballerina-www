

const isProduction = process.env.NODE_ENV === 'production';

const HOST =  isProduction 
                    ? BACKEND_HOST
                    : 'localhost:8080';

export const FETCH_LAUNCHER_API = `http${isProduction ? 's' : ''}://${isProduction ? 'controller.' : ''}${HOST}/api/launcher`;
export const PARSER_API_URL = `http${isProduction ? 's' : ''}://${isProduction ? 'parser.' : ''}${HOST}/api/parser`;