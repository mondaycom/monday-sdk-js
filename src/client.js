const mondayApi = require("./monday-api-client");
const { MONDAY_OAUTH_URL } = require("./constants.js");
const { convertToArrayIfNeeded } = require("./helpers");

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

    window.addEventListener("message", this._receiveMessage, false);
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
      return mondayApi(params, { token });
    } else {
      return new Promise((resolve, reject) => {
        this._localApi("api", { params }).then(result => {
          resolve(result.data);
        });
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

  oauth(options = {}) {
    const clientId = options.clientId || this._clientId;
    if (!clientId) throw new Error("clientId is required");

    const mondayOauthUrl = options.mondayOauthUrl || MONDAY_OAUTH_URL;

    const url = `${mondayOauthUrl}?client_id=${clientId}`;
    window.location = url;
  }

  _localApi(method, args) {
    return new Promise((resolve, reject) => {
      const requestId = this._generateRequestId();
      const clientId = this._clientId;

      window.parent.postMessage({ method, args, requestId, clientId }, "*");
      this._addListener(requestId, data => {
        resolve(data);
      });
    });
  }

  _receiveMessage(event) {
    const { method, type, requestId } = event.data;
    const methodListeners = this.listeners[method] || EMPTY_ARRAY;
    const typeListeners = this.listeners[type] || EMPTY_ARRAY;
    const requestIdListeners = this.listeners[requestId] || EMPTY_ARRAY;

    let listeners = [
      ...methodListeners,
      ...typeListeners,
      ...requestIdListeners
    ];

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
}

function init(options = {}) {
  return new MondayClientSdk(options);
}

module.exports = init;
