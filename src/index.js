const { isBrowser, isNode } = require('browser-or-node');
console.log("isBrowser", isBrowser)
const { monday } = isBrowser ? require("./client") : require("./server");

module.exports = {
  monday
}