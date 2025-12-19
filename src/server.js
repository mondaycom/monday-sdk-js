const { logWarnings } = require("./helpers/monday-api-helpers");
const mondayApiClient = require("./monday-api-client");
const { oauthToken } = require("./services/oauth-service.js");

const TOKEN_MISSING_ERROR = "Should send 'token' as an option or call mondaySdk.setToken(TOKEN)";

class MondayServerSdk {
  constructor(options = {}) {
    console.warn(
      "[DEPRECATION WARNING] The monday-sdk-js server SDK is deprecated and will be removed in version 1.0.0.\n" +
        "The 'api()' method for GraphQL queries should be replaced with the official @mondaydotcomorg/api package: https://www.npmjs.com/package/@mondaydotcomorg/api\n" +
        "For more information, visit: https://developer.monday.com/api-reference/docs/api-sdk"
    );

    this._token = options.token;
    this._apiVersion = options.apiVersion;

    this.setToken = this.setToken.bind(this);
    this.setApiVersion = this.setApiVersion.bind(this);
    this.api = this.api.bind(this);
  }

  setToken(token) {
    this._token = token;
  }

  setApiVersion(apiVersion) {
    this._apiVersion = apiVersion;
  }

  api(query, options = {}) {
    const params = { query, variables: options.variables };
    const token = options.token || this._token;
    const apiVersion = options.apiVersion || this._apiVersion;

    if (!token) throw new Error(TOKEN_MISSING_ERROR);

    return mondayApiClient.execute(params, token, { apiVersion }).then(logWarnings);
  }

  oauthToken(code, clientId, clientSecret) {
    return oauthToken(code, clientId, clientSecret);
  }
}

function init(options = {}) {
  return new MondayServerSdk(options);
}

module.exports = init;
