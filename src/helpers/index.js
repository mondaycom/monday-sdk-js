const convertToArrayIfNeeded = x => {
  return Array.isArray(x) ? x : [x];
};

module.exports = {
  convertToArrayIfNeeded
};
