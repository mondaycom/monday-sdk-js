const { expect } = require("./tests/helpers");
const constants = require("./constants");

describe("constants", () => {
  //setup
  beforeEach(() => {
    process.env.NODE_ENV = "development";
    process.env.MONDAY_DOMAIN = undefined;
    process.env.MONDAY_COM_PROTOCOL = undefined;
    process.env.MONDAY_COM_DOMAIN = undefined;
    process.env.MONDAY_SUBDOMAIN_API = undefined;
    process.env.MONDAY_OAUTH_SUBDOMAIN = undefined;
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

  describe("check that constants are correct when NODE_ENV is development", () => {
    it("MONDAY_DOMAIN should be correct", () => {
      expect(constants.MONDAY_DOMAIN).to.eq("monday.com");
    });

    it("MONDAY_PROTOCOL should be correct", () => {
      expect(constants.MONDAY_PROTOCOL).to.eq("https");
    });

    it("MONDAY_API_URL should be correct", () => {
      expect(constants.MONDAY_API_URL).to.eq("https://api.monday.com/v2");
    });

    it("MONDAY_OAUTH_URL should be correct", () => {
      expect(constants.MONDAY_OAUTH_URL).to.eq("https://auth.monday.com/oauth2/authorize");
    });

    it("MONDAY_OAUTH_TOKEN_URL should be correct", () => {
      expect(constants.MONDAY_OAUTH_TOKEN_URL).to.eq("https://auth.monday.com/oauth2/token");
    });
  });

  describe("check that constants are correct when NODE_ENV is undefined", () => {
    beforeEach(() => {
      process.env.NODE_ENV = undefined;
      process.env.MONDAY_COM_DOMAIN = "should not be used";
    });

    it("MONDAY_DOMAIN should be correct", () => {
      expect(constants.MONDAY_DOMAIN).to.eq("monday.com");
    });

    it("MONDAY_PROTOCOL should be correct", () => {
      expect(constants.MONDAY_PROTOCOL).to.eq("https");
    });

    it("MONDAY_API_URL should be correct", () => {
      expect(constants.MONDAY_API_URL).to.eq("https://api.monday.com/v2");
    });

    it("MONDAY_OAUTH_URL should be correct", () => {
      expect(constants.MONDAY_OAUTH_URL).to.eq("https://auth.monday.com/oauth2/authorize");
    });

    it("MONDAY_OAUTH_TOKEN_URL should be correct", () => {
      expect(constants.MONDAY_OAUTH_TOKEN_URL).to.eq("https://auth.monday.com/oauth2/token");
    });
  });

  describe("check that constants are correct when NODE_ENV is undefined", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      process.env.MONDAY_COM_DOMAIN = "should not be used";
    });

    it("MONDAY_DOMAIN should be correct", () => {
      expect(constants.MONDAY_DOMAIN).to.eq("monday.com");
    });

    it("MONDAY_PROTOCOL should be correct", () => {
      expect(constants.MONDAY_PROTOCOL).to.eq("https");
    });

    it("MONDAY_API_URL should be correct", () => {
      expect(constants.MONDAY_API_URL).to.eq("https://api.monday.com/v2");
    });

    it("MONDAY_OAUTH_URL should be correct", () => {
      expect(constants.MONDAY_OAUTH_URL).to.eq("https://auth.monday.com/oauth2/authorize");
    });

    it("MONDAY_OAUTH_TOKEN_URL should be correct", () => {
      expect(constants.MONDAY_OAUTH_TOKEN_URL).to.eq("https://auth.monday.com/oauth2/token");
    });
  });
});
