// webpack.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = env => {
  return {
    plugins: [
      new webpack.DefinePlugin({
        __BUNDLE__: env.WEBPACK_BUILD === "true"
      })
    ]
  };
};
