const mondayApi = require("./monday-api-client");

class MondaySdk {
  constructor() {
    this.token = this.token.bind(this);
    this.api = this.api.bind(this);
  }

  token(token) {
    this.apiToken = token;
  }

  api(query, options = {}) {
    const token = options.token || this.apiToken;
    return new Promise((resolve, reject) => {
      if (token) {
        mondayApi({ query }, { token })
          .then(data => resolve(data))
          .catch(error => reject(error));
      } else {
        reject("Should send 'token' as an option or call monday.token(TOKEN)");
      }
    })
  }
}

const monday = new MondaySdk();
module.exports = {
  monday
}