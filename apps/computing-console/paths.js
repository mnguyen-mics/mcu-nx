const path = require('path');

function resolve(relativePath) {
  return path.resolve(relativePath);
}

module.exports = {
  appHtml: resolve('apps/computing-console/index.html'),
  appDistHtml: resolve('dist/apps/computing-console/index.html'),
  reactAppSrc: resolve('apps/computing-console/src'),
  appStyleLess: resolve('apps/computing-console/src/styles/index.less'),
  appNodeModules: resolve('node_modules'),
  appPath: resolve('apps/computing-console'),
  appDistPath: resolve('dist/apps/computing-console/'),
  publicPath: '/',
  publicDistPath: '/react',
};
