const { isBrowser } = require("./helpers");
const init = isBrowser ? require("./client") : require("./server");

module.exports = init;
