const path = require('path');
// require("babel-register");

const config = {
  
  // Entry
  entry: { main: './src/index.js' },
  // Output
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  // Loaders
  module: {
    rules : [
      // JavaScript/JSX Files
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // CSS Files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
  // Plugins
//   plugins: [["@babel/plugin-proposal-class-properties"]]
};
// Exports
module.exports = config;