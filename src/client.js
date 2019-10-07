const mondayApi = require('./monday-api-client');
const { MONDAY_OAUTH_URL } = require('./constants.js');
const { prepareApiData } = require('./services/api-data-service');

class MondaySdk {
  constructor() {
    this.listeners = {};
    this.init = this.init.bind(this);
    this.token = this.token.bind(this);
    this.oauth = this.oauth.bind(this);

    this.api = this.api.bind(this);
    this.listen = this.listen.bind(this);
    this.get = this.get.bind(this);
    this.execute = this.execute.bind(this);

    this._receiveMessage = this._receiveMessage.bind(this);
    this._addListener = this._addListener.bind(this);
    this._localApi = this._localApi.bind(this);
  }

  init(clientId) {
    this.clientId = clientId;
    window.addEventListener('message', this._receiveMessage, false);
  }

  token(token) {
    this.apiToken = token;
  }

  api(data, options = {}) {
    const params = prepareApiData(data);
    const token = options.token || this.apiToken;
    if (token) {
      return mondayApi(params, { token });
    } else {
      return new Promise((resolve, reject) => {
        this._localApi('api', { params }).then(result => {
          resolve(result.data);
        });
      });
    }
  }

  _localApi(method, args) {
    return new Promise((resolve, reject) => {
      const requestId = this._generateRequestId();
      const clientId = this.clientId;

      window.parent.postMessage({ method, args, requestId, clientId }, '*');
      this._addListener(requestId, data => {
        resolve(data);
      });
    });
  }

  _receiveMessage(event) {
    const { method, requestId } = event.data;
    const methodListeners = this.listeners[method] || [];
    const requestIdListeners = this.listeners[requestId] || [];
    const listeners = [...methodListeners, ...requestIdListeners];

    if (listeners) {
      listeners.forEach(listener => {
        listener(event.data);
      });
    }
  }

  listen(type, callback) {
    this._addListener(type, callback);
    this._localApi('listen', { type });
    // todo uniq listeners, remove listener
  }

  get(type, params) {
    return this._localApi('get', { type, params });
  }

  execute(type, params) {
    return this._localApi('execute', { type, params });
  }

  _addListener(key, callback) {
    this.listeners[key] = this.listeners[key] || [];
    this.listeners[key].push(callback);
  }

  oauth() {
    const url = `${MONDAY_OAUTH_URL}?client_id=${this.clientId}&scope=me:monday_service_session`;
    window.location = url;
  }

  _generateRequestId() {
    return Math.random()
      .toString(36)
      .substr(2, 9);
  }
}

const monday = new MondaySdk();
exports.monday = monday;
