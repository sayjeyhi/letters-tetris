const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'src');
const dirAssets = path.join(__dirname, 'src/assets');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appHtmlTitle = 'Webpack Boilerplate';

/**
 * Webpack Configuration
 */
module.exports = {
    entry: {
        bundle: path.join(dirApp, 'javascript/loading/ArshLoader.js')
    },
    resolve: {
        modules: [
            dirNode,
            dirApp,
            dirAssets
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEV: IS_DEV
        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.ejs'),
            title: appHtmlTitle
        }),

        new CopyWebpackPlugin([ { from: './src/assets/', to: './assets/' } ]),

        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$|\.json$/
        })
    ],
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     include: path.join(__dirname, 'src/javascript'),
            //     exclude: /node_modules/,
            //     use: ['babel-loader', 'eslint-loader']
            // }

            // // BABEL
            // {
            //     test: /\.js$/,
            //     loader: 'babel-loader',
            //     include: path.join(__dirname, 'test'),
            //     exclude: /(node_modules)/,
            //     options: {
            //         compact: true,
            //         presets: ['preset-env']
            //     }
            // },
            // // STYLES
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 sourceMap: IS_DEV
            //             }
            //         },
            //     ]
            // },
            //
            // // CSS / SASS
            // {
            //     test: /\.scss/,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 sourceMap: IS_DEV
            //             }
            //         },
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 sourceMap: IS_DEV,
            //                 includePaths: [dirAssets]
            //             }
            //         }
            //     ]
            // },
            //
            // // IMAGES
            // {
            //     test: /\.(jpe?g|png|gif)$/,
            //     loader: 'file-loader',
            //     options: {
            //         name: '[path][name].[ext]'
            //     }
            // }
        ]
    }
};
