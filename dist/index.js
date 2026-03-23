var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/helpers/index.js
var require_helpers = __commonJS({
  "src/helpers/index.js"(exports2, module2) {
    var convertToArrayIfNeeded = (x) => {
      return Array.isArray(x) ? x : [x];
    };
    var isBrowser2 = typeof window !== "undefined" && typeof window.document !== "undefined";
    module2.exports = {
      convertToArrayIfNeeded,
      isBrowser: isBrowser2
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

// src/helpers/ui-helpers.js
var require_ui_helpers = __commonJS({
  "src/helpers/ui-helpers.js"(exports2, module2) {
    var scrollHelperInitialized = false;
    function initScrollHelperIfNeeded() {
      if (scrollHelperInitialized) return;
      scrollHelperInitialized = true;
      const css = 'body::before { content: ""; position: fixed; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; z-index: 2147483647; /* mondaySdk css - can be disabled with: mondaySdk({withoutScrollHelper: true }) */ }';
      const style = document.createElement("style");
      style.appendChild(document.createTextNode(css));
      const head = document.head || document.getElementsByTagName("head")[0];
      head.appendChild(style);
    }
    module2.exports = {
      initScrollHelperIfNeeded
    };
  }
});

// src/services/background-tracking-service.js
var require_background_tracking_service = __commonJS({
  "src/services/background-tracking-service.js"(exports2, module2) {
    var _5_MINUTES_MS = 5 * 60 * 1e3;
    var initialized = false;
    var initBackgroundTracking = (sdk) => {
      if (initialized) return;
      initialized = true;
      const ping = () => {
        sdk.track("ping");
      };
      ping();
      setInterval(ping, _5_MINUTES_MS);
    };
    module2.exports = {
      initBackgroundTracking
    };
  }
});

// src/helpers/monday-api-helpers.js
var require_monday_api_helpers = __commonJS({
  "src/helpers/monday-api-helpers.js"(exports2, module2) {
    var logWarnings = (res) => {
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
      logWarnings
    };
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "monday-sdk-js",
      version: "0.5.8",
      private: false,
      repository: "https://github.com/mondaycom/monday-sdk-js",
      main: "dist/index.js",
      types: "types/index.d.ts",
      exports: {
        ".": {
          types: "./types/index.d.ts",
          require: "./dist/index.js",
          default: "./dist/index.js"
        },
        "./server-sdk": "./server-sdk.js"
      },
      author: "talharamati <tal@monday.com>",
      license: "MIT",
      files: [
        "LICENSE",
        "README.md",
        "dist/",
        "types/",
        "server-sdk.js"
      ],
      devDependencies: {
        chai: "^4.2.0",
        eslint: "^6.8.0",
        jsdom: "^16.2.0",
        mocha: "^7.1.0",
        prettier: "^1.19.1",
        sinon: "^9.0.0",
        "sinon-chai": "^3.5.0",
        tsup: "^8.5.1",
        typescript: "^4.9.5"
      },
      scripts: {
        start: "tsup --watch",
        build: "tsup",
        postbuild: `node -e "const fs=require('fs');if(fs.existsSync('dist/main.global.js'))fs.renameSync('dist/main.global.js','dist/main.js')"`,
        test: "mocha './src/**/*-test.js'",
        "test:watch": "mocha './src/**/*-test.js' --watch",
        precommit: "yarn lint && yarn style-check",
        lint: "eslint './src/**/*.*'",
        "style-check": "prettier --check './src/**/*.js'",
        "style-fix": "prettier --write './src/**/*.js'",
        "compile-types": "tsc --noEmit"
      }
    };
  }
});

// src/client.js
var require_client = __commonJS({
  "src/client.js"(exports2, module2) {
    var mondayApiClient = require_monday_api_client2();
    var { MONDAY_OAUTH_URL, REPORT_TIME_PHASES } = require_constants();
    var { convertToArrayIfNeeded } = require_helpers();
    var { initScrollHelperIfNeeded } = require_ui_helpers();
    var { initBackgroundTracking } = require_background_tracking_service();
    var { logWarnings } = require_monday_api_helpers();
    var EMPTY_ARRAY = [];
    var STORAGE_SEGMENT_KINDS = {
      GLOBAL: "v2",
      INSTANCE: "instance"
    };
    var MondayClientSdk = class {
      constructor(options = {}) {
        this._clientId = options.clientId;
        this._apiToken = options.apiToken;
        this._apiVersion = options.apiVersion;
        this.listeners = {};
        this.setClientId = this.setClientId.bind(this);
        this.setToken = this.setToken.bind(this);
        this.setApiVersion = this.setApiVersion.bind(this);
        this.api = this.api.bind(this);
        this.listen = this.listen.bind(this);
        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this.execute = this.execute.bind(this);
        this.reportTime = this.reportTime.bind(this);
        this.oauth = this.oauth.bind(this);
        this._receiveMessage = this._receiveMessage.bind(this);
        this.storage = {
          setItem: this.setStorageItem.bind(this),
          getItem: this.getStorageItem.bind(this),
          deleteItem: this.deleteStorageItem.bind(this),
          instance: {
            setItem: this.setStorageInstanceItem.bind(this),
            getItem: this.getStorageInstanceItem.bind(this),
            deleteItem: this.deleteStorageInstanceItem.bind(this)
          }
        };
        window.addEventListener("message", this._receiveMessage, false);
        if (!options.withoutScrollHelper) initScrollHelperIfNeeded();
        initBackgroundTracking(this);
      }
      setClientId(clientId) {
        this._clientId = clientId;
      }
      setToken(token) {
        this._apiToken = token;
      }
      setApiVersion(apiVersion) {
        this._apiVersion = apiVersion;
      }
      api(query, options = {}) {
        const params = { query, variables: options.variables };
        const token = options.token || this._apiToken;
        const apiVersion = options.apiVersion || this._apiVersion;
        let responsePromise;
        if (token) {
          responsePromise = mondayApiClient.execute(params, token, { apiVersion });
        } else {
          responsePromise = this._localApi("api", { params, apiVersion }).then((result) => result.data);
        }
        return responsePromise.then(logWarnings);
      }
      listen(typeOrTypes, callback, params) {
        const types = convertToArrayIfNeeded(typeOrTypes);
        const unsubscribes = [];
        types.forEach((type) => {
          unsubscribes.push(this._addListener(type, callback));
          this._localApi("listen", { type, params });
        });
        return () => {
          unsubscribes.forEach((unsubscribe) => unsubscribe());
        };
      }
      get(type, params) {
        return this._localApi("get", { type, params });
      }
      set(type, params) {
        return this._localApi("set", { type, params });
      }
      execute(type, params) {
        return this._localApi("execute", { type, params });
      }
      track(name, data) {
        return this.execute("track", { name, data });
      }
      reportTime(phase, data = {}) {
        const allowedPhases = Object.values(REPORT_TIME_PHASES);
        if (!allowedPhases.includes(phase)) {
          return;
        }
        const params = { phase, ...data };
        const sdkPerformanceMetrics = {
          memoryMetrics: this._collectMemoryMetrics()
        };
        if (phase === REPORT_TIME_PHASES.LOAD) {
          sdkPerformanceMetrics.resourceMetrics = this._collectResourceMetrics();
        }
        params.sdkPerformanceMetrics = sdkPerformanceMetrics;
        return this.execute("reportTime", params);
      }
      _collectMemoryMetrics() {
        const memory = typeof performance !== "undefined" && performance.memory;
        if (!memory) {
          return null;
        }
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
      _collectResourceMetrics() {
        if (typeof performance === "undefined") return null;
        const resourceEntries = performance.getEntriesByType("resource");
        let origin = "";
        try {
          origin = new URL(resourceEntries[0].name).origin;
        } catch (e) {
        }
        return resourceEntries.map((r) => ({
          name: origin ? r.name.replace(origin, "") : r.name,
          tsSize: r.transferSize,
          encSize: r.encodedBodySize,
          dur: Math.round(r.duration)
        }));
      }
      oauth(options = {}) {
        const clientId = options.clientId || this._clientId;
        if (!clientId) throw new Error("clientId is required");
        const mondayOauthUrl = options.mondayOauthUrl || MONDAY_OAUTH_URL;
        const url = `${mondayOauthUrl}?client_id=${clientId}`;
        window.location = url;
      }
      setStorageItem(key, value, options = {}) {
        return this._localApi("storage", { method: "set", key, value, options, segment: STORAGE_SEGMENT_KINDS.GLOBAL });
      }
      getStorageItem(key, options = {}) {
        return this._localApi("storage", { method: "get", key, options, segment: STORAGE_SEGMENT_KINDS.GLOBAL });
      }
      deleteStorageItem(key, options = {}) {
        return this._localApi("storage", { method: "delete", key, options, segment: STORAGE_SEGMENT_KINDS.GLOBAL });
      }
      setStorageInstanceItem(key, value, options = {}) {
        return this._localApi("storage", { method: "set", key, value, options, segment: STORAGE_SEGMENT_KINDS.INSTANCE });
      }
      getStorageInstanceItem(key, options = {}) {
        return this._localApi("storage", { method: "get", key, options, segment: STORAGE_SEGMENT_KINDS.INSTANCE });
      }
      deleteStorageInstanceItem(key, options = {}) {
        return this._localApi("storage", { method: "delete", key, options, segment: STORAGE_SEGMENT_KINDS.INSTANCE });
      }
      _localApi(method, args) {
        return new Promise((resolve, reject) => {
          const requestId = this._generateRequestId();
          const clientId = this._clientId;
          const pjson = require_package();
          const version = pjson.version;
          window.parent.postMessage({ method, args, requestId, clientId, version }, "*");
          const removeListener = this._addListener(requestId, (data) => {
            removeListener();
            if (data.errorMessage) {
              const error = new Error(data.errorMessage);
              error.data = data.data;
              reject(error);
            } else {
              resolve(data);
            }
          });
        });
      }
      _receiveMessage(event) {
        const { method, type, requestId } = event.data;
        const methodListeners = this.listeners[method] || EMPTY_ARRAY;
        const typeListeners = this.listeners[type] || EMPTY_ARRAY;
        const requestIdListeners = this.listeners[requestId] || EMPTY_ARRAY;
        let listeners = /* @__PURE__ */ new Set([...methodListeners, ...typeListeners, ...requestIdListeners]);
        if (listeners) {
          listeners.forEach((listener) => {
            try {
              listener(event.data);
            } catch (err) {
              console.error("Message callback error: ", err);
            }
          });
        }
      }
      _addListener(key, callback) {
        this.listeners[key] = this.listeners[key] || /* @__PURE__ */ new Set();
        this.listeners[key].add(callback);
        return () => {
          this.listeners[key].delete(callback);
          if (this.listeners[key].size === 0) {
            delete this.listeners[key];
          }
        };
      }
      _generateRequestId() {
        return Math.random().toString(36).substring(2, 9);
      }
      _removeEventListener() {
        window.removeEventListener("message", this._receiveMessage, false);
      }
      _clearListeners() {
        this.listeners = [];
      }
    };
    function init2(options = {}) {
      return new MondayClientSdk(options);
    }
    module2.exports = init2;
  }
});

// src/services/oauth-service.js
var require_oauth_service = __commonJS({
  "src/services/oauth-service.js"(exports2, module2) {
    var { execute } = require_monday_api_client2();
    var { MONDAY_OAUTH_TOKEN_URL } = require_constants();
    var oauthToken = (code, clientId, clientSecret) => {
      const data = { code, client_id: clientId, client_secret: clientSecret };
      return execute(data, null, { url: MONDAY_OAUTH_TOKEN_URL });
    };
    module2.exports = {
      oauthToken
    };
  }
});

// src/server.js
var require_server = __commonJS({
  "src/server.js"(exports2, module2) {
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
    function init2(options = {}) {
      return new MondayServerSdk(options);
    }
    module2.exports = init2;
  }
});

// src/index.js
var { isBrowser } = require_helpers();
var init = isBrowser ? require_client() : require_server();
module.exports = init;
