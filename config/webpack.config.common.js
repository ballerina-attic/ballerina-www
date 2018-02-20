
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports.plugins = [
    // Copies Monaco Editor
    new CopyWebpackPlugin([
    {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
    }]),
];