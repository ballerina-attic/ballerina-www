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
 const fs = require('fs');
 const webpack = require('webpack');
 const ExtractTextPlugin = require('extract-text-webpack-plugin');
 const ProgressBarPlugin = require('progress-bar-webpack-plugin');
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
 const WriteFilePlugin = require('write-file-webpack-plugin');
 const CopyWebpackPlugin = require('copy-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const CleanWebpackPlugin = require('clean-webpack-plugin');
 const WebfontPlugin = require('webpack-webfont').default;
 
 const isProductionBuild = process.env.NODE_ENV === 'production';
 const hashToUse = isProductionBuild ? 'chunkhash' : 'hash';
 const backendHost = 'playground.preprod.ballerina.io';

 const moduleRoot = path.resolve(__dirname, '../');
 const buildPath = path.resolve(__dirname, '../build');
 const composerWebRoot = path.join(__dirname, '../ballerina-lang/composer/modules/web');
 
 const extractCSSBundle = new ExtractTextPlugin({ filename: `./[name].[${hashToUse}].css`, allChunks: true });

 const isExternal = function(modulePath) {
     return modulePath.includes('node_modules');
 };
 
 // Keeps unicode codepoints of font-ballerina for each icon name
const codepoints = {}

 const config = {
     target: 'web',
     entry: {
         'playground': './src/index.js',
         'vendor': [
            'react',
            'react-dom',
            'prop-types',
            'react-custom-scrollbars',
            'semantic-ui-react',
            'classnames',
            'axios',
            'react-monaco-editor',
            'babel-polyfill',
            'react-dnd',
            'react-dnd-html5-backend'
         ]
     },
     output: {
         filename: `[name].[${hashToUse}].js`,
         chunkFilename: `[name].[${hashToUse}].js`,
         path: buildPath,
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
             use: extractCSSBundle.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    },
                }],
            })
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
         {
            test: /\.bal$/,
            use: 'raw-loader'
          }
         ],
     },
     plugins: [
         new ProgressBarPlugin(),
         new CleanWebpackPlugin([buildPath], { watch: true, root: moduleRoot }),
         extractCSSBundle,
         new webpack.WatchIgnorePlugin([path.join(composerWebRoot, 'font/dist/')]),
         new WebfontPlugin({
            files: path.join(composerWebRoot, 'font/font-ballerina/icons/**/*.svg'),
            cssTemplateFontPath: 'fonts/',
            fontName: 'font-ballerina',
            fontHeight: 1000,
            normalize: true,
            cssTemplateClassName: 'fw',
            template: path.join(composerWebRoot, 'font/font-ballerina/template.css.njk'),
            glyphTransformFn: (obj) => {
                codepoints[obj.name] = obj.unicode;
            },
            dest: {
                fontsDir: path.join(composerWebRoot, 'font/dist/font-ballerina/fonts'),
                stylesDir: path.join(composerWebRoot, 'font/dist/font-ballerina/css'),
                outputFilename: 'font-ballerina.css',
            },
            hash: new Date().getTime(),
        }),
        {
            apply: function(compiler) {
                compiler.plugin('compile', function(compilation, callback) {
                    fs.writeFile(
                        path.join(composerWebRoot, 'font/dist/font-ballerina/codepoints.json'),
                        JSON.stringify(codepoints),
                        'utf8',
                        callback
                    );
                });
            }
        },
         new WriteFilePlugin(),
         new CopyWebpackPlugin([
            {
                from: path.join(composerWebRoot, 'font/dist/font-ballerina/fonts'),
                to: 'fonts',
            },
            {
                from: 'public'
            },
            {
                from: 'images',
                to: 'images'
            },
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs'
            },
            {
                from: 'node_modules/semantic-ui-css/themes',
                to: 'themes'
            },
            {
                from: 'guides',
                to: 'resources/guides',
                ignore: [ '*.md',  '*LICENSE', '*.gitignore', '*.db', '*.conf', '*.balx', '*.sh']
            },
         ]),
         new HtmlWebpackPlugin({
            template: 'src/index.ejs'
        }),
        new webpack.DefinePlugin({
            BACKEND_HOST: JSON.stringify(backendHost),
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
               name: 'manifest'
        })
     ],
     devServer: {
         port: 3000,
         contentBase: path.join(__dirname, buildPath)
     },
     node: { module: 'empty', net: 'empty', fs: 'empty' },
     devtool: 'source-map',
     resolve: {
        extensions: ['.js', '.json', '.jsx'],
        modules: ['./node_modules'],
        alias: {
            'samples/images': path.join(moduleRoot, '..', 'playground-examples', 'images'),
            'samples': path.join(moduleRoot, 'guides', 'playground-hello-service'),
            'composer': path.join(composerWebRoot, 'src'),
            'scss': path.join(composerWebRoot, 'scss'),
            'log': 'composer/core/log/log',
            'event_channel': 'composer/core/event/channel',
            'launch-manager': 'composer/plugins/debugger/LaunchManager',
            'ballerina-grammar': 'composer/plugins/ballerina/utils/monarch-grammar',
            'ballerina-config': 'composer/plugins/ballerina/utils/monaco-lang-config',
            'Diagram': 'composer/plugins/ballerina/diagram/diagram',
            'src/plugins': 'composer/plugins',
            'plugins': 'composer/plugins',
            'font-ballerina': path.join(composerWebRoot, 'font/dist/font-ballerina'),
            'api-client':  'composer/api-client',
            'images': path.join(composerWebRoot, 'public/images'),
            'TreeBuilder': 'composer/plugins/ballerina/model/tree-builder',
            'PackageScopedEnvironment': 'composer/plugins/ballerina/env/package-scoped-environment'
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
            keep_fnames: true,
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