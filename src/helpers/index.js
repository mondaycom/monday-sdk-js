const convertToArrayIfNeeded = x => {
  return Array.isArray(x) ? x : [x];
};

const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

module.exports = {
  convertToArrayIfNeeded,
  isBrowser
};
