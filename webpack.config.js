const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'src');
const dirAssets = path.join(__dirname, 'src/public/');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appHtmlTitle = 'Webpack Boilerplate';

/**
 * Webpack Configuration
 */
module.exports = {
    entry: {
        bundle: path.join(dirApp, 'public/javascript/loading/ArshLoader.js')
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

        new CopyWebpackPlugin([ { from: './src/public/assets/', to: './assets/' } ])
    ],
    module: {
        rules: [
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
