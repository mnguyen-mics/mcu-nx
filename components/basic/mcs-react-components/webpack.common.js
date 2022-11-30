const path = require('path');
const glob = require('glob');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: glob.sync('./src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'McsReactComponents',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/style', to: './style' },
        { from: './components/**/*.less', to: '[path][name].[ext]', context: 'src' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/,
        include: path.resolve('src'),
        loaders: ['babel-loader', 'ts-loader'],
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
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  performance: { hints: false },
};
