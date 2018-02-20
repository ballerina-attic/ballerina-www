const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports.plugins = [
    // Copies Monaco Editor
    new CopyWebpackPlugin([
    {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
    }]),
];

module.exports.alias = {
    'ballerina-grammar': path.join(__dirname, '../../web/src/plugins/ballerina/utils/monarch-grammar'),
    'ballerina-config': path.join(__dirname, '../../web/src/plugins/ballerina/utils/monaco-lang-config')
}