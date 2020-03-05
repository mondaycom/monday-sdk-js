const { isBrowser } = require("./helpers");
const init = isBrowser ? require("./client") : require("./server");

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = { init: factory() };
  } else if (root) {
    root.init = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  return init;
});
