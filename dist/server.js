var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/helpers/monday-api-helpers.js
var require_monday_api_helpers = __commonJS({
  "src/helpers/monday-api-helpers.js"(exports2, module2) {
    var logWarnings2 = (res) => {
      const warnings = res && res.extensions && res.extensions.warnings;
      if (!warnings || !Array.isArray(warnings)) return res;
      warnings.forEach((warning) => {
        if (!warning || !warning.message) return;
        try {
          const locations = warning.locations && warning.locations.map((loc) => `line ${loc.line}, column ${loc.column}`).join("; ");
          const path = warning.path && warning.path.join(" \u2192 ");
          let message = warning.message;
          message = message.replace(/\.$/, "");
          message = message.charAt(0).toLowerCase() + message.slice(1);
          const messageParts = [
            "[monday API]",
            `${path}:`,
            message,
            locations && `@ ${locations}`,
            warning.extensions ? ["\n\nAdditional details:", warning.extensions] : void 0
          ].flat().filter(Boolean);
          console.warn(...messageParts);
        } catch (e) {
          if (warning) {
            console.warn("[monday API] Warning:", warning);
          }
        }
      });
      return res;
    };
    module2.exports = {
      logWarnings: logWarnings2
    };
  }
});

// src/constants.js
var require_constants = __commonJS({
  "src/constants.js"(exports2, module2) {
    function isNodeEnv() {
      return typeof process !== "undefined";
    }
    function isNodeDevStageEnv() {
      return isNodeEnv() && (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging");
    }
    var getEnvOrDefault = (key, defaultVal) => {
      return isNodeDevStageEnv() && process.env[key] !== "undefined" && process.env[key] !== void 0 ? process.env[key] : defaultVal;
    };
    var MONDAY_PROTOCOL = () => getEnvOrDefault("MONDAY_COM_PROTOCOL", "https");
    var MONDAY_DOMAIN = () => getEnvOrDefault("MONDAY_COM_DOMAIN", "monday.com");
    var MONDAY_SUBDOMAIN_API = () => getEnvOrDefault("MONDAY_SUBDOMAIN_API", "api.");
    var MONDAY_OAUTH_SUBDOMAIN = () => getEnvOrDefault("MONDAY_OAUTH_SUBDOMAIN", "auth.");
    var MONDAY_API_URL = () => `${MONDAY_PROTOCOL()}://${MONDAY_SUBDOMAIN_API()}${MONDAY_DOMAIN()}/v2`;
    var MONDAY_OAUTH_URL = () => `${MONDAY_PROTOCOL()}://${MONDAY_OAUTH_SUBDOMAIN()}${MONDAY_DOMAIN()}/oauth2/authorize`;
    var MONDAY_OAUTH_TOKEN_URL = () => `${MONDAY_PROTOCOL()}://${MONDAY_OAUTH_SUBDOMAIN()}${MONDAY_DOMAIN()}/oauth2/token`;
    var REPORT_TIME_PHASES = {
      LOAD: "load",
      INTERACTIVE: "interactive"
    };
    module2.exports = {
      REPORT_TIME_PHASES,
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
  }
});

// src/monday-api-client/fetch.js
var require_fetch = __commonJS({
  "src/monday-api-client/fetch.js"(exports2, module2) {
    function nodeFetch(url, options = {}) {
      if (typeof globalThis.fetch !== "function") {
        throw new Error("Fetch API is not available in this environment");
      }
      return globalThis.fetch(url, options);
    }
    module2.exports = {
      nodeFetch
    };
  }
});

// src/monday-api-client/monday-api-client.js
var require_monday_api_client = __commonJS({
  "src/monday-api-client/monday-api-client.js"(exports2, module2) {
    var { MONDAY_API_URL, MONDAY_OAUTH_TOKEN_URL } = require_constants();
    var fetch = require_fetch();
    var COULD_NOT_PARSE_JSON_RESPONSE_ERROR = "Could not parse JSON from monday.com's GraphQL API response";
    var TOKEN_IS_REQUIRED_ERROR = "Token is required";
    var API_TIMEOUT_ERROR = "Received timeout from monday.com's GraphQL API";
    function apiRequest(url, data, token, options = {}) {
      return fetch.nodeFetch(url, {
        method: options.method || "POST",
        body: JSON.stringify(data || {}),
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          ...options.apiVersion ? { "API-Version": options.apiVersion } : {}
        }
      });
    }
    async function execute(data, token, options = {}) {
      if (!token && options.url !== MONDAY_OAUTH_TOKEN_URL) throw new Error(TOKEN_IS_REQUIRED_ERROR);
      const url = options.url || MONDAY_API_URL;
      const path = options.path || "";
      const fullUrl = `${url}${path}`;
      let response = await apiRequest(fullUrl, data, token, options);
      const responseStatusCode = response.status;
      const responseContentType = response.headers.get("content-type");
      if (!responseContentType || !responseContentType.includes("application/json")) {
        if (responseStatusCode === 504) {
          throw new Error(API_TIMEOUT_ERROR);
        }
        const responseText = await response.text();
        throw new Error(responseText);
      }
      try {
        return await response.json();
      } catch (err) {
        throw new Error(COULD_NOT_PARSE_JSON_RESPONSE_ERROR);
      }
    }
    module2.exports = { execute, COULD_NOT_PARSE_JSON_RESPONSE_ERROR, TOKEN_IS_REQUIRED_ERROR, API_TIMEOUT_ERROR };
  }
});

// src/monday-api-client/index.js
var require_monday_api_client2 = __commonJS({
  "src/monday-api-client/index.js"(exports2, module2) {
    module2.exports = require_monday_api_client();
  }
});

// src/services/oauth-service.js
var require_oauth_service = __commonJS({
  "src/services/oauth-service.js"(exports2, module2) {
    var { execute } = require_monday_api_client2();
    var { MONDAY_OAUTH_TOKEN_URL } = require_constants();
    var oauthToken2 = (code, clientId, clientSecret) => {
      const data = { code, client_id: clientId, client_secret: clientSecret };
      return execute(data, null, { url: MONDAY_OAUTH_TOKEN_URL });
    };
    module2.exports = {
      oauthToken: oauthToken2
    };
  }
});

// src/server.js
var { logWarnings } = require_monday_api_helpers();
var mondayApiClient = require_monday_api_client2();
var { oauthToken } = require_oauth_service();
var TOKEN_MISSING_ERROR = "Should send 'token' as an option or call mondaySdk.setToken(TOKEN)";
var MondayServerSdk = class {
  constructor(options = {}) {
    console.warn(
      "[DEPRECATION WARNING] The monday-sdk-js server SDK is deprecated and will be removed in version 1.0.0.\nThe 'api()' method for GraphQL queries should be replaced with the official @mondaydotcomorg/api package: https://www.npmjs.com/package/@mondaydotcomorg/api\nFor more information, visit: https://developer.monday.com/api-reference/docs/api-sdk"
    );
    this._token = options.token;
    this._apiVersion = options.apiVersion;
    this.setToken = this.setToken.bind(this);
    this.setApiVersion = this.setApiVersion.bind(this);
    this.api = this.api.bind(this);
  }
  setToken(token) {
    this._token = token;
  }
  setApiVersion(apiVersion) {
    this._apiVersion = apiVersion;
  }
  api(query, options = {}) {
    const params = { query, variables: options.variables };
    const token = options.token || this._token;
    const apiVersion = options.apiVersion || this._apiVersion;
    if (!token) throw new Error(TOKEN_MISSING_ERROR);
    return mondayApiClient.execute(params, token, { apiVersion }).then(logWarnings);
  }
  oauthToken(code, clientId, clientSecret) {
    return oauthToken(code, clientId, clientSecret);
  }
};
function init(options = {}) {
  return new MondayServerSdk(options);
}
module.exports = init;
