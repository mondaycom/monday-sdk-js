const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

chai.use(sinonChai);

const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>", {
  url: "http://localhost"
});
global.window = dom.window;
global.window.parent = dom.window;
global.document = dom.window.document;

module.exports = {
  chai,
  expect: chai.expect,
  assert: sinon.assert,
  sinon
};
