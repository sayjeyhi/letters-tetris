// Karma configuration
// Generated on Wed Jul 11 2018 06:12:40 GMT+0430 (+0430)
var path = require("path");

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],
        files: [
            "test/tests.webpack.js"
            // { pattern: 'test/*.html', included: false },
        ],
        preprocessors: {
            "test/tests.webpack.js": ["webpack", "sourcemap"]
        },
        webpack: {
            cache: true,
            mode: "development",
            devtool: "inline-source-map",
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        include: path.resolve("src/"),
                        enforce: "pre",
                        loader: "babel-loader"
                    },
                    {
                        test: /\.js?$/,
                        include: path.resolve("src/"),
                        loader: "babel-loader"
                    }
                ]
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "html"],

        htmlReporter: {
            outputFile: "test_result/report.html",
            // Optional
            pageTitle: "ArshTeam TetrisGame Unit Tests Report",
            subPageTitle: "Fanavard - Final UI Develop 96-97",
            groupSuites: true,
            useCompactStyle: true
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['ChromeHeadless'],
        browsers: ["FirefoxHeadless"],
        customLaunchers: {
            FirefoxHeadless: {
                base: "Firefox",
                flags: ["-headless"]
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
