const prepareApiData = data => {
  let query, variables;
  if (typeof data == "string") {
    query = data;
  } else {
    query = data.query;
    variables = data.variables;
  }

  return { query, variables };
};

module.exports = {
  prepareApiData
};
