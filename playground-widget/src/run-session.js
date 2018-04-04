// See http://tools.ietf.org/html/rfc6455#section-7.4.1
const WS_NORMAL_CODE = 1000;
const WS_SSL_CODE = 1015;

/**
 * RunSession
 *
 * @class RunSession
 */
class RunSession {

    /**
     * Creates an instance of RunSession.
     * @param {Object} args - connection configurations
     *
     * @memberof RunSession
     */
    constructor(endpoint) {
        if (!endpoint) {
            throw new Error('Invalid Endpoint');
        }
        this.endpoint = endpoint;
    }

    /**
     * init to run api and register callbacks
     *
     * @memberof RunSession
     */
    init({ 
            onMessage = () => {}, 
            onOpen = () => {},
            onClose = () => {}, 
            onError = () => {},
        }) {
        const websocket = new WebSocket(this.endpoint);
        // bind functions
        websocket.onmessage = (strMessage) => { onMessage(JSON.parse(strMessage.data)); };
        websocket.onopen = onOpen;
        websocket.onclose = onClose;
        websocket.onerror = onError;
        this.websocket = websocket;
    }

     /**
     * Send message to run given ballerina source and execute curl after
     * 
     * @param {String} fileName - fileName
     * @param {String} source - source
     * @param {String} curl - curl command
     * @param {Number} noOfCurlExecutions - no of curl executions
     *
     * @memberof LaunchManager
     */
    run(fileName, source, curl, noOfCurlExecutions) {
        this.sendMessage({
            command: 'run',
            fileName,
            source,
            curl,
            noOfCurlExecutions,
        });
    }

    /**
     * send stop command.
     *
     * @memberof RunSession
     */
    stop() {
        this.sendMessage({
            command: 'stop',
        });
    }

    /**
     * Sends message to backend
     * 
     * @param {Object} message - object to send
     *
     * @memberof RunSession
     */
    sendMessage(message) {
        this.websocket.send(JSON.stringify(message));
    }

    /**
     * Close websocket channel.
     *
     * @memberof RunSession
     */
    close() {
        this.websocket.close();
    }
}

export default RunSession;