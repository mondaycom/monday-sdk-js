const mondayApi = require("./monday-api-client");
const { getToken } = require("./services/oauth-service.js");
const { prepareApiData } = require("./services/api-data-service");

class MondaySdk {
  constructor() {
    this.token = this.token.bind(this);
    this.api = this.api.bind(this);
  }

  token(token) {
    this.apiToken = token;
  }

  api(data, options = {}) {
    const params = prepareApiData(data);
    const token = options.token || this.apiToken;
    return new Promise((resolve, reject) => {
      if (token) {
        mondayApi(params, { token })
          .then(data => resolve(data))
          .catch(error => reject(error));
      } else {
        reject("Should send 'token' as an option or call monday.token(TOKEN)");
      }
    });
  }

  getToken(code, clientId, clientSecret) {
    return getToken(code, clientId, clientSecret);
  }
}

const monday = new MondaySdk();
module.exports = {
  monday
};
