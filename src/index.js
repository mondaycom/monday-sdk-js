import mondayApi from "./monday-api-client";

window.monday = {
  listeners: {},
  init: client_id => {
    window.monday.client_id = client_id;
    window.addEventListener("message", window.monday.receiveMessage, false);
  },
  token: token => {
    window.monday.token = token;
  },
  api: query => {
    console.log("api", query, window.monday.token);
    return mondayApi({ query }, { token: window.monday.token });
  },
  localApi: (method, args) => {
    return new Promise(function(resolve, reject) {
      window.parent.postMessage({ method, args }, "*");

      var receiveMessage = event => {
        if (event.data.method == method) {
          resolve(event.data);
          window.removeEventListener("message", receiveMessage);
        }
      };

      window.addEventListener("message", receiveMessage, false);
    });
  },
  receiveMessage: (event) => {
    const { method } = event.data;
    const listeners = window.monday.listeners[method];
    if (listeners) {
      listeners.forEach(listener => {
        listener(event.data);
      });
    }
  },
  listen: (type, callback) => {
    window.monday.localApi("listen", { type });
    window.monday.listeners[type] = window.monday.listeners[type] || [];
    window.monday.listeners[type].push(callback);
    // todo uniq listeners, remove listener
  },
  authenticate: () => {
    var url = `http://auth.lvh.me/oauth/authorize?client_id=${
      window.monday.client_id
    }&scope=me:monday_service_session`;
    window.location = url;
  }
};
