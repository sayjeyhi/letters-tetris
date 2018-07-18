


const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

    devtool: 'eval',

    output: {
        pathinfo: true,
        publicPath: '/',
        filename: 'App_[name].js'
    },

    devServer: {
        host: '127.0.0.1'
    }

});
