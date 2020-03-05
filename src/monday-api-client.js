const fetch = require("node-fetch");
const { MONDAY_API_URL } = require("./constants.js");

const COULD_NOT_PARSE_JSON_RESPONSE_ERROR = "Could not parse monday graphql response to JSON";

async function apiRequest(url, data, token, options = {}) {
  return fetch(url, {
    method: options.method || "POST",
    body: JSON.stringify(data || {}),
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    }
  });
}

async function execute(data, token, options = {}) {
  const url = options.url || MONDAY_API_URL;
  const path = options.path || "";
  const fullUrl = `${url}${path}`;
  let response = await apiRequest(fullUrl, data, token, options);

  try {
    return await response.json();
  } catch (err) {
    throw new Error(COULD_NOT_PARSE_JSON_RESPONSE_ERROR);
  }
}

module.exports = { execute };
