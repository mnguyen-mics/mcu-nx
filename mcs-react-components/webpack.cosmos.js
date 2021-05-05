const path = require('path');
const merge = require('webpack-merge');

module.exports = webpackConfig => {
  return merge(webpackConfig, {
    module: {
      rules: [
        {
          test: /\.(css|less)$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },
  });
};
