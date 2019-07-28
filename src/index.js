import mondayApi from "./monday-api-client";

window.monday = {
  init: client_id => {
    window.monday.client_id = client_id;
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
        resolve(event.data);
        window.removeEventListener("message", receiveMessage);
      };

      window.addEventListener("message", receiveMessage, false);
    });
  },
  authenticate: () => {
    var url = `http://auth.lvh.me/oauth/authorize?client_id=${
      window.monday.client_id
    }&scope=me:monday_service_session`;
    window.location = url;
  }
};
