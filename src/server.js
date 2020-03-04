const mondayApi = require("./monday-api-client");
const { getOauthAccessToken } = require("./services/oauth-service.js");

const TOKEN_MISSING_ERROR =
  "Should send 'token' as an option or call mondaySdk.setToken(TOKEN)";

class MondayServerSdk {
  constructor(options = {}) {
    this._token = options.token;

    this.setToken = this.setToken.bind(this);
    this.api = this.api.bind(this);
  }

  setToken(token) {
    this._token = token;
  }

  async api(query, options = {}) {
    const params = { query, variables: options.variables };
    const token = options.token || this._token;

    if (!token) throw new Error(TOKEN_MISSING_ERROR);

    return await mondayApi(params, token);
  }

  getOauthAccessToken(code, clientId, clientSecret) {
    return getOauthAccessToken(code, clientId, clientSecret);
  }
}

function init(options = {}) {
  return new MondayServerSdk(options);
}

module.exports = init;
