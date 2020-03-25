const { execute } = require("../monday-api-client");
const { MONDAY_OAUTH_TOKEN_URL } = require("../constants.js");

const oauthToken = (code, clientId, clientSecret) => {
  const data = { code, client_id: clientId, client_secret: clientSecret };
  return execute(data, null, { url: MONDAY_OAUTH_TOKEN_URL });
};

module.exports = {
  oauthToken
};
