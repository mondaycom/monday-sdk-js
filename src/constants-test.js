const { expect } = require("./tests/helpers");
const constants = require("./constants");

describe("constants", () => {
  it("should have at least 3 constants", () => {
    expect(Object.keys(constants).length).to.be.at.least(3);
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
