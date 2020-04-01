const path = require('path');
var glob = require("glob");

module.exports = {
	mode: 'production',
  entry: 	glob.sync('./src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'lib'),
		filename: 'index.js',
		libraryTarget: 'umd',
		library: 'McsReactComponents',
  },
  module: {
    rules: [
			{
				test: /\.(ts|tsx)?$/,
				include: path.resolve('src'),
				loaders: ['babel-loader', 'ts-loader'],
				exclude: /node_modules/,
      },
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
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js'],
	},
	performance: { hints: false },
};
