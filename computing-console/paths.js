const path = require('path');

function resolve(relativePath) {
  return path.resolve(relativePath);
}

module.exports = {
  appHtml: resolve('app/index.html'),
  appDistHtml: resolve('dist/index.html'),
  reactAppSrc: resolve('app/src'),
  appStyleLess: resolve('app/src/styles/index.less'),
  appNodeModules: resolve('node_modules'),
  appPath: resolve('app'),
  appDistPath: resolve('dist/'),
  publicPath: '/',
  publicDistPath: '/',
};
