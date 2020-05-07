const { isBrowser } = require("./helpers");
const init = isBrowser ? require("./client") : require("./server");

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else if (root) {
    root = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  if (typeof __BUNDLE__ !== "undefined" && __BUNDLE__) {
    window.mondaySdk = init;
  }
  return init;
});
