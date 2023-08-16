const mondayApiClient = require("./monday-api-client");
const { MONDAY_OAUTH_URL } = require("./constants.js");
const { convertToArrayIfNeeded } = require("./helpers");
const { initScrollHelperIfNeeded } = require("./helpers/ui-helpers");
const { initBackgroundTracking } = require("./services/background-tracking-service");
const { logWarnings } = require("./helpers/monday-api-helpers");

const EMPTY_ARRAY = [];

const STORAGE_SEGMENT_KINDS = {
  GLOBAL: "v2",
  INSTANCE: "instance"
};

class MondayClientSdk {
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
      responsePromise = this._localApi("api", { params, apiVersion }).then(result => result.data);
    }

    return responsePromise.then(logWarnings);
  }

  listen(typeOrTypes, callback, params) {
    const types = convertToArrayIfNeeded(typeOrTypes);
    const unsubscribes = [];

    types.forEach(type => {
      unsubscribes.push(this._addListener(type, callback));
      this._localApi("listen", { type, params });
    });

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
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
      const pjson = require("../package.json");
      const version = pjson.version;

      window.parent.postMessage({ method, args, requestId, clientId, version }, "*");
      const removeListener = this._addListener(requestId, data => {
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
    let listeners = new Set([...methodListeners, ...typeListeners, ...requestIdListeners]);

    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event.data);
        } catch (err) {
          console.error("Message callback error: ", err);
        }
      });
    }
  }

  _addListener(key, callback) {
    this.listeners[key] = this.listeners[key] || new Set();
    this.listeners[key].add(callback);

    return () => {
      this.listeners[key].delete(callback);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    };
  }

  _generateRequestId() {
    return Math.random()
      .toString(36)
      .substring(2, 9);
  }

  _removeEventListener() {
    window.removeEventListener("message", this._receiveMessage, false);
  }
  _clearListeners() {
    this.listeners = [];
  }
}

function init(options = {}) {
  return new MondayClientSdk(options);
}

module.exports = init;
