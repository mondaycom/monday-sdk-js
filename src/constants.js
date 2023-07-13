const { isBrowser } = require("./helpers");

const isNodeDevEnv = !isBrowser && process.env.NODE_ENV === "development";

const MONDAY_PROTOCOL = (isNodeDevEnv && process.env.MONDAY_COM_PROTOCOL) || "https";
const MONDAY_DOMAIN = (isNodeDevEnv && process.env.MONDAY_COM_DOMAIN) || "monday.com";
const MONDAY_SUBDOMAIN_API = (isNodeDevEnv && typeof process.env.MONDAY_SUBDOMAIN_API !== 'undefined') ? process.env.MONDAY_SUBDOMAIN_API : "api.";
const MONDAY_API_URL = `${MONDAY_PROTOCOL}://${MONDAY_SUBDOMAIN_API}${MONDAY_DOMAIN}/v2`;
const MONDAY_OAUTH_SUBDOMAIN = (isNodeDevEnv && typeof process.env.MONDAY_OAUTH_SUBDOMAIN !== 'undefined') ? process.env.MONDAY_SUBDOMAIN_API : "auth.";
const MONDAY_OAUTH_URL = `${MONDAY_PROTOCOL}://${MONDAY_OAUTH_SUBDOMAIN}${MONDAY_DOMAIN}/oauth2/authorize`;
const MONDAY_OAUTH_TOKEN_URL = `${MONDAY_PROTOCOL}://${MONDAY_OAUTH_SUBDOMAIN}${MONDAY_DOMAIN}/oauth2/token`;

module.exports = {
  MONDAY_DOMAIN,
  MONDAY_PROTOCOL,
  MONDAY_API_URL,
  MONDAY_OAUTH_URL,
  MONDAY_OAUTH_TOKEN_URL
};
