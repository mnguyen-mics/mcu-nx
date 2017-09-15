module.exports = {
  presets: [
    ['es2015', { modules: false }],
    'react',
    'stage-2',
  ],
  plugins: [
    'react-hot-loader/babel',
    ['react-intl', {
      messagesDir: './build/messages',
    }],
  ],
};
