const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@layout-content-background'   : '#f1f1f1'
            },
            javascriptEnabled: true,
          },
        },
        modifyLessRule: (lessRule) => {
          lessRule.use = lessRule.use.filter(i => !i.loader.includes('resolve-url-loader'));
          return lessRule;
        } 
      },
    },
  ],
};