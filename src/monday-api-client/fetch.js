function nodeFetch(url, options = {}) {
  if (typeof globalThis.fetch !== "function") {
    throw new Error("Fetch API is not available in this environment");
  }
  return globalThis.fetch(url, options);
}

module.exports = {
  nodeFetch
};
