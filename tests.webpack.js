var testsContext = require.context('./test', true, /-test\.js$/);
testsContext.keys().forEach(testsContext);

var srcContext = require.context('./src/public/javascript/classes', true, /^((?!__tests__).)*.js$/);
srcContext.keys().forEach(srcContext);
