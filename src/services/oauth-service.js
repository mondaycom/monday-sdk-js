const mondayApi = require("../monday-api-client");
const { MONDAY_OAUTH_TOKEN_URL } = require("../constants.js");

const getOauthAccessToken = (code, clientId, clientSecret) => {
  const data = { code, client_id: clientId, client_secret: clientSecret };
  return mondayApi(data, { url: MONDAY_OAUTH_TOKEN_URL });
};

module.exports = {
  getOauthAccessToken
};
