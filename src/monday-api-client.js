const fetch = require("node-fetch");
const { MONDAY_API_URL } = require("./constants.js");

const client = async (data, options = {}) => {
  const url = options.url || MONDAY_API_URL;
  const path = options.path || "";
  const fullUrl = `${url}${path}`;
  let response = await fetch(fullUrl, {
    method: options.method || "POST",
    body: JSON.stringify(data || {}),
    headers: {
      Authorization: options.token,
      "Content-Type": "application/json"
    }
  });

  let results;
  try {
    results = await response.json();
  } catch (err) {
    const logMessage = "Could not parse monday graphql response to JSON";
    throw new Error(logMessage);
  }

  return results;
};

module.exports = client;
