const mondayApiClient = require("./monday-api-client");
const { MONDAY_OAUTH_URL } = require("./constants.js");
const { convertToArrayIfNeeded } = require("./helpers");
const { initScrollHelperIfNeeded } = require("./helpers/ui-helpers");
const { initBackgroundTracking } = require("./services/background-tracking-service");

const EMPTY_ARRAY = [];

class MondayClientSdk {
  constructor(options = {}) {
    this._clientId = options.clientId;
    this._apiToken = options.apiToken;

    this.listeners = {};

    this.setClientId = this.setClientId.bind(this);
    this.setToken = this.setToken.bind(this);
    this.api = this.api.bind(this);
    this.listen = this.listen.bind(this);
    this.get = this.get.bind(this);
    this.execute = this.execute.bind(this);
    this.oauth = this.oauth.bind(this);
    this._receiveMessage = this._receiveMessage.bind(this);

    this.storage = {
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

  api(query, options = {}) {
    const params = { query, variables: options.variables };
    const token = options.token || this._apiToken;
    if (token) {
      return mondayApiClient.execute(params, token);
    } else {
      return new Promise((resolve, reject) => {
        this._localApi("api", { params })
          .then(result => {
            resolve(result.data);
          })
          .catch(err => reject(err));
      });
    }
  }

  listen(typeOrTypes, callback, params) {
    const types = convertToArrayIfNeeded(typeOrTypes);
    types.forEach(type => {
      this._addListener(type, callback);
      this._localApi("listen", { type, params });
    });
    // todo uniq listeners, remove listener
  }

  get(type, params) {
    return this._localApi("get", { type, params });
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

  setStorageInstanceItem(key, value, options = {}) {
    return this._localApi("storage", { method: "set", key, value, options, segment: "instance" });
  }

  getStorageInstanceItem(key, options = {}) {
    return this._localApi("storage", { method: "get", key, options, segment: "instance" });
  }

  deleteStorageInstanceItem(key, options = {}) {
    return this._localApi("storage", { method: "delete", key, options, segment: "instance" });
  }

  _localApi(method, args) {
    return new Promise((resolve, reject) => {
      const requestId = this._generateRequestId();
      const clientId = this._clientId;
      const pjson = require("../package.json");
      const version = pjson.version;

      window.parent.postMessage({ method, args, requestId, clientId, version }, "*");
      this._addListener(requestId, data => {
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
    let listeners = [...methodListeners, ...typeListeners, ...requestIdListeners];

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
    this.listeners[key] = this.listeners[key] || [];
    this.listeners[key].push(callback);
  }

  _generateRequestId() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
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
