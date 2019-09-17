import mondayApi from "./monday-api-client";

class MondaySdk {
  constructor() {
    window.monday = this;
    this.listeners = {};
    this.init = this.init.bind(this);
    this.token = this.token.bind(this);
    this.api = this.api.bind(this);
    this.localApi = this.localApi.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.listen = this.listen.bind(this);
    this.addListener = this.addListener.bind(this);
    this.authenticate = this.authenticate.bind(this);
  }

  init(clientId) {
    this.clientId = clientId;
    window.addEventListener("message", this.receiveMessage, false);
  }

  token(token) {
    this.apiToken = token;
  }

  api(query) {
    if (this.apiToken) {
      return mondayApi({ query }, { token: this.apiToken });
    } else {
      return new Promise((resolve, reject) => {
        this.localApi("api", { query }).then(result => {
          resolve(result.data);
        });
      });
    }
  }

  localApi(method, args) {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substr(2, 9);
      const clientId = this.clientId;
      
      window.parent.postMessage({ method, args, requestId, clientId }, "*");
      this.addListener(requestId, data => {
        resolve(data);
      });
    });
  }

  receiveMessage(event) {
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
    this.addListener(type, callback);
    this.localApi("listen", { type });
    // todo uniq listeners, remove listener
  }

  addListener(key, callback) {
    this.listeners[key] = this.listeners[key] || [];
    this.listeners[key].push(callback);
  }

  authenticate() {
    const url = `https://auth.monday.com/oauth/authorize?client_id=${this.clientId}&scope=me:monday_service_session`;
    window.location = url;
  }
}

new MondaySdk();