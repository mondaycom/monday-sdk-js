const fetch = require("node-fetch");
const { MONDAY_API_URL } = require("./constants.js");

const client = async (data, options = {}) => {
  const url = `${MONDAY_API_URL}${options.path || ""}`;
  let response = await fetch(url, {
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
