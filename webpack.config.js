const path       = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode:    process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',

  entry: {
    'background/service-worker': './src/background/service-worker.js',
    'content/content-main':      './src/content/content-main.js',
    'popup/popup':               './src/popup/popup.js',
    'options/options':           './src/options/options.js',
  },

  output: {
    path:     path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean:    true,
  },

  module: {
    rules: [
      {
        test:    /\\.js$/,
        exclude: /node_modules/,
        use:     'babel-loader',
      },
      {
        test: /\\.css$/,
        use:  ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json',              to: '.' },
        { from: 'src/popup/popup.html',       to: 'popup/' },
        { from: 'src/options/options.html',   to: 'options/' },
        { from: 'assets/',                    to: 'assets/' },
      ],
    }),
  ],
};
