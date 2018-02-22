const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports.plugins = [
    // Copies Monaco Editor
    new CopyWebpackPlugin([
    {
        from: 'samples',
        to: 'resources/samples'
    },
    {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs'
    }]),
];

module.exports.alias = {
    'log': path.join(__dirname, '../../web/src/core/log/log'),
    'event_channel': path.join(__dirname, '../../web/src/core/event/channel'),
    'launch-manager': path.join(__dirname, '../../web/src/plugins/debugger/LaunchManager'),
    'ballerina-grammar': path.join(__dirname, '../../web/src/plugins/ballerina/utils/monarch-grammar'),
    'ballerina-config': path.join(__dirname, '../../web/src/plugins/ballerina/utils/monaco-lang-config')
}