

const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    contentBase: './public',
    disableHostCheck: true,
    // hot: true
    host: '0.0.0.0',
    port: 9000,
    // allowedHosts: [
    //   '192.120.32.179'
    // ]
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
};
