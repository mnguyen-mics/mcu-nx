module.exports = {
  webpack: (config, { env }) => {    
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'ts-loader',
              },
            ],
          },
          {
            test: /\.(css|less)$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader' },
              { loader: 'less-loader',
                options: {
                  javascriptEnabled: true
                }
              }
            ]
            
          }
        ],
      },
      resolve: {
        extensions: [
          ...config.resolve.extensions,
          '.ts',
          '.tsx',
        ],
      }
    };
  },
  globalImports: ['./utils/cosmos/style/index.less']
};