const { isBrowser } = require("./helpers");

const MONDAY_PROTOCOL =
  (!isBrowser && process.env.MONDAY_COM_PROTOCOL) || "https";
const MONDAY_DOMAIN =
  (!isBrowser && process.env.MONDAY_COM_DOMAIN) || "monday.com";
const MONDAY_API_URL = `${MONDAY_PROTOCOL}://api.${MONDAY_DOMAIN}/v2`;
const MONDAY_OAUTH_URL = `${MONDAY_PROTOCOL}://auth.${MONDAY_DOMAIN}/oauth2/authorize`;
const MONDAY_OAUTH_TOKEN_URL = `${MONDAY_PROTOCOL}://auth.${MONDAY_DOMAIN}/oauth2/token`;

module.exports = {
  MONDAY_DOMAIN,
  MONDAY_PROTOCOL,
  MONDAY_API_URL,
  MONDAY_OAUTH_URL,
  MONDAY_OAUTH_TOKEN_URL
};
