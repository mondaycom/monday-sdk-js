const mondaySdk = require("./index");

if (typeof window !== "undefined") {
  window.mondaySdk = mondaySdk;
}

module.exports = mondaySdk;
