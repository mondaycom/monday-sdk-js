const { execute } = require("../monday-api-client/monday-api-client");
const { logWarnings } = require("../helpers/monday-api-helpers");

const TOKEN_MISSING_ERROR = "Should send 'token' as an option or call mondaySdk.setToken(TOKEN)";

function callExecute(sdk, query, variables, apiVersion) {
  const token = sdk._token || sdk._apiToken;
  if (!token) throw new Error(TOKEN_MISSING_ERROR);
  const version = apiVersion || sdk._apiVersion;
  return execute({ query, variables }, token, { apiVersion: version }).then(logWarnings);
}

module.exports = function itemsApi(sdk) {
  return {
    async createItem({ boardId, name, columnValues }, apiVersion) {
      const query = `mutation ($boardId: Int!, $name: String!, $columnValues: JSON) {\n  create_item(board_id: $boardId, item_name: $name, column_values: $columnValues) { id name }\n}`;
      const variables = { boardId, name, columnValues };
      const result = await callExecute(sdk, query, variables, apiVersion);
      return result.data.create_item;
    },

    async getItem({ itemId }, apiVersion) {
      const query = `query ($itemId: Int!) {\n  items(ids: [$itemId]) { id name }\n}`;
      const variables = { itemId };
      const result = await callExecute(sdk, query, variables, apiVersion);
      return result.data.items[0];
    },

    async archiveItem({ itemId }, apiVersion) {
      const query = `mutation ($itemId: Int!) {\n  archive_item(item_id: $itemId) { id state }\n}`;
      const variables = { itemId };
      const result = await callExecute(sdk, query, variables, apiVersion);
      return result.data.archive_item;
    },

    async listBoardItems({ boardId, limit = 25, cursor, queryParams }, apiVersion) {
      let query;
      let variables;
      if (cursor && limit === undefined && !queryParams) {
        query = `query ($boardId: Int!, $cursor: String!) {\n  boards(ids: [$boardId]) {\n    next_items_page(cursor: $cursor) {\n      cursor\n      items { id name }\n    }\n  }\n}`;
        variables = { boardId, cursor };
      } else {
        query = `query ($boardId: Int!, $limit: Int, $cursor: String, $queryParams: JSON) {\n  boards(ids: [$boardId]) {\n    items_page(limit: $limit, cursor: $cursor, query_params: $queryParams) {\n      cursor\n      items { id name }\n    }\n  }\n}`;
        variables = { boardId, limit, cursor, queryParams };
      }
      const result = await callExecute(sdk, query, variables, apiVersion);
      const board = result.data.boards[0];
      const page = board.items_page || board.next_items_page;
      return {
        items: page.items,
        pageInfo: { limit, cursor: page.cursor || null, hasNextPage: Boolean(page.cursor) }
      };
    }
  };
};
