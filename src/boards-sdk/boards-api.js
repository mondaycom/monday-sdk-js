const { execute } = require("../monday-api-client/monday-api-client");
const { logWarnings } = require("../helpers/monday-api-helpers");

const TOKEN_MISSING_ERROR = "Should send 'token' as an option or call mondaySdk.setToken(TOKEN)";

function callExecute(sdk, query, variables, apiVersion) {
  const token = sdk._token || sdk._apiToken;
  if (!token) throw new Error(TOKEN_MISSING_ERROR);
  const version = apiVersion || sdk._apiVersion;
  return execute({ query, variables }, token, { apiVersion: version }).then(logWarnings);
}

module.exports = function boardsApi(sdk) {
  return {
    async createBoard({ name, kind }, apiVersion) {
      const query = `mutation ($name: String!, $kind: BoardKind) {\n  create_board(board_name: $name, board_kind: $kind) { id name board_kind }\n}`;
      const variables = { name, kind };
      const result = await callExecute(sdk, query, variables, apiVersion);
      return result.data.create_board;
    },

    async getBoard({ boardId }, apiVersion) {
      const query = `query ($boardId: Int!) {\n  boards(ids: [$boardId]) { id name board_kind state }\n}`;
      const variables = { boardId };
      const result = await callExecute(sdk, query, variables, apiVersion);
      return result.data.boards[0];
    },

    async archiveBoard({ boardId }, apiVersion) {
      const query = `mutation ($boardId: Int!) {\n  archive_board(board_id: $boardId) { id state }\n}`;
      const variables = { boardId };
      const result = await callExecute(sdk, query, variables, apiVersion);
      return result.data.archive_board;
    }
  };
};
