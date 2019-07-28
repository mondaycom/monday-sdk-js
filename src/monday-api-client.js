const fetch = require("node-fetch");
const MONDAY_API_URL = `http://api.lvh.me/v2`;

const client = async (data, options = {}) => {
  const url = `${MONDAY_API_URL}${options.path || ""}`;

  let results = await fetch(url, {
    method: options.method || "POST",
    body: JSON.stringify(data || {}),
    headers: {
      Authorization: options.token,
      "Content-Type": "application/json"
    }
  });

  results = await results.json();
  return results;
};

const client2 = async (data, options = {}) => {
  const url = `${MONDAY_API_URL}${options.path || ""}`;
  let response = await fetch(url, {
    method: options.method || "POST",
    body: JSON.stringify(data || {}),
    headers: {
      Authorization: options.token,
      "Content-Type": "application/json"
    }
  });

  const responseContentType = response.headers.get("content-type");
  if (!responseContentType.includes("application/json")) {
    const logMessage =
      "Invalid content-type on response from monday api graphql";
    throw new Error(logMessage);
  }

  let results;
  try {
    results = await response.json();
  } catch (err) {
    const logMessage = "Could not parse monday graphql response to JSON";
    throw new Error(logMessage);
  }

  if (results.errors) {
    const logMessage = "Graphql validation errors";
    throw new Error(logMessage);
  }

  const {
    status_code: statusCode,
    error_code: errorCode,
    error_message: errorMessage,
    error_data: errorData
  } = results;
  if (!response.ok || errorCode) {
    const logMessage =
      "There was an error in response from monday.com graphql API";
    const errorDataStr = JSON.stringify(errorData);

    throw new ApiError(logMessage, {
      statusCode,
      errorCode,
      errorMessage,
      errorData
    });
  }

  return results;
};

module.exports = client2;
