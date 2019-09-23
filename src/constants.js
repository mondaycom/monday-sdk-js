let MONDAY_DOMAIN, MONDAY_PROTOCOL;

if (process.env.NODE_ENV == "development") {
  MONDAY_DOMAIN = "lvh.me";
  MONDAY_PROTOCOL = "http";
} else {
  MONDAY_DOMAIN = "monday.com";
  MONDAY_PROTOCOL = "https";
}

const MONDAY_API_URL = `${MONDAY_PROTOCOL}://api.${MONDAY_DOMAIN}/v2`;
const MONDAY_OAUTH_URL = `${MONDAY_PROTOCOL}://auth.${MONDAY_DOMAIN}/oauth/authorize`;

export { MONDAY_DOMAIN, MONDAY_PROTOCOL, MONDAY_API_URL, MONDAY_OAUTH_URL };
