const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: ['@babel/polyfill', './src/popup.ts'],
    content_script: ['@babel/polyfill', './src/content_script.ts']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  resolve: {
      extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }]
  },
  plugins: [
    new CopyPlugin([
      {from: 'public', to: ''}
    ])
  ]
};
