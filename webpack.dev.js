const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // Easier debugging
  devServer: {
    static: './dist',
    watchFiles: ['./src/**/*'],
    port: 3000,
    open: true, // Opens browser automatically
    hot: true,  // Hot Module Replacement
  },
});