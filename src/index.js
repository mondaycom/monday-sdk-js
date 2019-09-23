const { isBrowser, isNode } = require('browser-or-node');
const { monday } = isBrowser ? require("./client") : require("./server");

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = { monday: factory() };
  } else if (root) {
    root.monday = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
    return monday;
}));