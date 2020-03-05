const fetch = require("node-fetch");

// for tests - to allow stubbing node-fetch with sinon
function nodeFetch(url, options = {}) {
  return fetch(url, options);
}

module.exports = {
  nodeFetch
};
