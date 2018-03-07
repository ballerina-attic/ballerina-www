/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
 const path = require('path');
 const webpack = require('webpack');
 const ExtractTextPlugin = require('extract-text-webpack-plugin');
 const ProgressBarPlugin = require('progress-bar-webpack-plugin');
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
 const WriteFilePlugin = require('write-file-webpack-plugin');
 const CopyWebpackPlugin = require('copy-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const CleanWebpackPlugin = require('clean-webpack-plugin');
 
 const extractCSSBundle = new ExtractTextPlugin({ filename: './[name]-[hash].css', allChunks: true });
 
 const isProductionBuild = process.env.NODE_ENV === 'production';
 
 const isExternal = function(modulePath) {
     return modulePath.includes('node_modules');
 };
 
 const config = {
     target: 'web',
     entry: {
         bundle: './src/index.js',
     },
     output: {
         filename: '[name]-[hash].js',
         path: path.resolve(__dirname, '../build'),
     },
     module: {
         rules: [{
             test: /\.js$/,
             exclude: isExternal,
             use: [
                 {
                     loader: 'babel-loader',
                     query: {
                         presets: ['es2015', 'react'],
                     },
                 },
                 'source-map-loader',
             ],
         },
         {
             test: /\.html$/,
             exclude: isExternal,
             use: [{
                 loader: 'html-loader',
             }],
         },
         {
             test: /\.scss$/,
             exclude: isExternal,
             loader: 'style-loader!css-loader!sass-loader',
         },
         {
             test: /\.css$/,
             use: extractCSSBundle.extract({
                 fallback: 'style-loader',
                 use: [{
                     loader: 'css-loader',
                     options: {
                         url: false,
                         sourceMap: true,
                     },
                 }],
             }),
         },
         {
             test: /\.(png|jpg|svg|cur|gif|eot|svg|ttf|woff|woff2)$/,
             use: ['url-loader'],
         },
         {
             test: /\.jsx$/,
             exclude: isExternal,
             use: [
                 {
                     loader: 'babel-loader',
                     query: {
                         presets: ['es2015', 'react'],
                     },
                 },
             ],
         },
         ],
     },
     plugins: [
         new ProgressBarPlugin(),
         new CleanWebpackPlugin(['../build'], {watch: true, exclude:['themes']}),
         extractCSSBundle,
         new WriteFilePlugin(),
         new CopyWebpackPlugin([
            {
                from: 'public'
            },
            {
                from: 'samples',
                to: 'resources/samples'
            },
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs'
            }
         ]),
         new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            inject: false,
        })
     ],
     devServer: {
         contentBase: path.join(__dirname, "../build"),
     },
     node: { module: 'empty', net: 'empty', fs: 'empty' },
     devtool: 'source-map',
     resolve: {
        extensions: ['.js', '.json', '.jsx'],
        modules: ['./node_modules'],
        alias: {
            'log': path.join(__dirname, '../../web/src/core/log/log'),
            'event_channel': path.join(__dirname, '../../web/src/core/event/channel'),
            'launch-manager': path.join(__dirname, '../../web/src/plugins/debugger/LaunchManager'),
            'ballerina-grammar': path.join(__dirname, '../../web/src/plugins/ballerina/utils/monarch-grammar'),
            'ballerina-config': path.join(__dirname, '../../web/src/plugins/ballerina/utils/monaco-lang-config')
        }
     },
 
 };

 if (isProductionBuild) {
     // Add UglifyJsPlugin only when we build for production.
     // uglyfying slows down webpack build so we avoid in when in development
     config.plugins.push(new UglifyJsPlugin({
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
            mangle: {
                keep_fnames: true,
            },
        }
    }));
    config.plugins.push(new webpack.DefinePlugin({
        // React does some optimizations if NODE_ENV is set to 'production'
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }));
 }

 module.exports = config;