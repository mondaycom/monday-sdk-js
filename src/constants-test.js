const { expect } = require("./tests/helpers");
const constants = require("./constants");

describe("constants", () => {
  //setup
  beforeEach(() => {
    process.env.NODE_ENV = "development";
    // Using `process.env.VARIABLE = undefined` becomes an "undefined" string instead of actual undefined variable
    // delete makes sure the variable does not exist and thus is undefined.
    delete process.env.MONDAY_COM_PROTOCOL;
    delete process.env.MONDAY_COM_DOMAIN;
    delete process.env.MONDAY_SUBDOMAIN_API;
    delete process.env.MONDAY_OAUTH_SUBDOMAIN;
  });

  it("should have at least 3 constants", () => {
    expect(Object.keys(constants).length).to.be.at.least(3);
  });

  it("check that constants changed after setting env variables", () => {
    const MONDAY_COM_PROTOCOL = "http";
    const MONDAY_COM_DOMAIN = "mondaystaging.com";
    const MONDAY_SUBDOMAIN_API = "";
    const MONDAY_OAUTH_SUBDOMAIN = "authZ.";
    const MONDAY_API_URL = `${MONDAY_COM_PROTOCOL}://${MONDAY_SUBDOMAIN_API}${MONDAY_COM_DOMAIN}/v2`;
    const MONDAY_OAUTH_URL = `${MONDAY_COM_PROTOCOL}://${MONDAY_OAUTH_SUBDOMAIN}${MONDAY_COM_DOMAIN}/oauth2/authorize`;
    const MONDAY_OAUTH_TOKEN_URL = `${MONDAY_COM_PROTOCOL}://${MONDAY_OAUTH_SUBDOMAIN}${MONDAY_COM_DOMAIN}/oauth2/token`;
    process.env.MONDAY_COM_PROTOCOL = MONDAY_COM_PROTOCOL;
    process.env.MONDAY_COM_DOMAIN = MONDAY_COM_DOMAIN;
    process.env.MONDAY_SUBDOMAIN_API = MONDAY_SUBDOMAIN_API;
    process.env.MONDAY_OAUTH_SUBDOMAIN = MONDAY_OAUTH_SUBDOMAIN;

    expect(constants.MONDAY_DOMAIN).to.eq(MONDAY_COM_DOMAIN);
    expect(constants.MONDAY_PROTOCOL).to.eq(MONDAY_COM_PROTOCOL);
    expect(constants.MONDAY_API_URL).to.eq(MONDAY_API_URL);
    expect(constants.MONDAY_OAUTH_URL).to.eq(MONDAY_OAUTH_URL);
    expect(constants.MONDAY_OAUTH_TOKEN_URL).to.eq(MONDAY_OAUTH_TOKEN_URL);
  });

  it("constants should be correct", () => {
    const keys = Object.keys(constants);
    let key;
    let value;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      value = constants[key];

      switch (key) {
        case "MONDAY_DOMAIN": {
          expect(value).to.eq("monday.com");
          break;
        }

        case "MONDAY_PROTOCOL": {
          expect(value).to.eq("https");
          break;
        }

        case "MONDAY_API_URL": {
          expect(value).to.eq("https://api.monday.com/v2");
          break;
        }

        case "MONDAY_OAUTH_URL": {
          expect(value).to.eq("https://auth.monday.com/oauth2/authorize");
          break;
        }

        case "MONDAY_OAUTH_TOKEN_URL": {
          expect(value).to.eq("https://auth.monday.com/oauth2/token");
          break;
        }

        default: {
          throw new Error(`missing test for this constant: ${key}`);
        }
      }
    }
  });
});
