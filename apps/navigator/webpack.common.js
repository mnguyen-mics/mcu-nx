const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_ENV': JSON.stringify(process.env.API_ENV),
    }),
  ],
};
