const { defineConfig } = require("tsup");

module.exports = defineConfig([
  {
    entry: {
      index: "src/index.js",
      server: "src/server.js"
    },
    format: ["cjs"],
    target: "es2018",
    outDir: "dist",
    platform: "node",
    clean: true,
    splitting: false,
    minify: false
  },
  {
    entry: { main: "src/browser.js" },
    format: ["iife"],
    platform: "browser",
    target: "es2018",
    outDir: "dist",
    clean: false,
    minify: true,
    splitting: false
  }
]);
