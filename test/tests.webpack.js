var testsContext = require.context('./', true, /-spec\.js$/);
testsContext.keys().forEach(testsContext);

var srcContext = require.context('../src/public/javascript/classes/', true, /\.js$/);
srcContext.keys().forEach(srcContext);
