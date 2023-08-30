function isNodeEnv() {
  return typeof process !== "undefined";
}

function isNodeDevStageEnv() {
  return isNodeEnv() && (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging");
}

const getEnvOrDefault = (key, defaultVal) => {
  return isNodeDevStageEnv() && process.env[key] !== "undefined" && process.env[key] !== undefined
    ? process.env[key]
    : defaultVal;
};

const MONDAY_PROTOCOL = () => getEnvOrDefault("MONDAY_COM_PROTOCOL", "https");
const MONDAY_DOMAIN = () => getEnvOrDefault("MONDAY_COM_DOMAIN", "monday.com");
const MONDAY_SUBDOMAIN_API = () => getEnvOrDefault("MONDAY_SUBDOMAIN_API", "api.");
const MONDAY_OAUTH_SUBDOMAIN = () => getEnvOrDefault("MONDAY_OAUTH_SUBDOMAIN", "auth.");

const MONDAY_API_URL = () => `${MONDAY_PROTOCOL()}://${MONDAY_SUBDOMAIN_API()}${MONDAY_DOMAIN()}/v2`;
const MONDAY_OAUTH_URL = () => `${MONDAY_PROTOCOL()}://${MONDAY_OAUTH_SUBDOMAIN()}${MONDAY_DOMAIN()}/oauth2/authorize`;
const MONDAY_OAUTH_TOKEN_URL = () =>
  `${MONDAY_PROTOCOL()}://${MONDAY_OAUTH_SUBDOMAIN()}${MONDAY_DOMAIN()}/oauth2/token`;

module.exports = {
  get MONDAY_DOMAIN() {
    return MONDAY_DOMAIN();
  },
  get MONDAY_PROTOCOL() {
    return MONDAY_PROTOCOL();
  },
  get MONDAY_API_URL() {
    return MONDAY_API_URL();
  },
  get MONDAY_OAUTH_URL() {
    return MONDAY_OAUTH_URL();
  },
  get MONDAY_OAUTH_TOKEN_URL() {
    return MONDAY_OAUTH_TOKEN_URL();
  }
};
