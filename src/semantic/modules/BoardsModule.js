const SemanticModule = require("../core/SemanticModule");
const { BOARD_QUERIES } = require("../queries/boards");
const { parseGraphQLResponse, formatBoardData } = require("../core/ResponseTransformer");
const { validateParameters, validateId } = require("../core/SemanticError");

/**
 * Semantic API for board operations
 */
class BoardsModule extends SemanticModule {
  static get name() {
    return "boards";
  }

  static get version() {
    return "1.0.0";
  }

  /**
   * Create a new board
   * @param {string} name - Board name
   * @param {string} [kind='public'] - Board kind ('public', 'private', 'share')
   * @param {Object} [options={}] - Additional options
   * @param {number} [options.templateId] - Template ID to use
   * @param {string} [options.description] - Board description
   * @param {boolean} [options.raw] - Return raw GraphQL response
   * @returns {Promise<Object>} Created board object
   */
  async createBoard(name, kind = "public", options = {}) {
    return this._handleApiCall("createBoard", async () => {
      validateParameters({ name }, ["name"]);

      const variables = {
        boardName: name,
        boardKind: kind,
        templateId: options.templateId,
        description: options.description
      };

      const response = await this._executeQuery(BOARD_QUERIES.CREATE_BOARD, variables, options);
      const boardData = parseGraphQLResponse(response, "create_board", options);

      return options.raw ? boardData : formatBoardData(boardData);
    });
  }

  /**
   * Get a board by ID
   * @param {number|string} boardId - Board ID
   * @param {Object} [options={}] - Query options
   * @param {boolean} [options.raw] - Return raw GraphQL response
   * @returns {Promise<Object|null>} Board object or null if not found
   */
  async getBoard(boardId, options = {}) {
    return this._handleApiCall("getBoard", async () => {
      const validatedId = validateId(boardId, "boardId");

      const variables = {
        boardId: validatedId
      };

      const response = await this._executeQuery(BOARD_QUERIES.GET_BOARD, variables, options);
      const boards = parseGraphQLResponse(response, "boards", options);

      if (options.raw) {
        return boards;
      }

      return boards && boards.length > 0 ? formatBoardData(boards[0]) : null;
    });
  }

  /**
   * Get multiple boards
   * @param {Object} [options={}] - Query options
   * @param {number} [options.limit] - Maximum number of boards to return
   * @param {number} [options.page] - Page number for pagination
   * @param {string} [options.state] - Board state filter ('active', 'archived', 'deleted')
   * @param {boolean} [options.raw] - Return raw GraphQL response
   * @returns {Promise<Array>} Array of board objects
   */
  async getBoards(options = {}) {
    return this._handleApiCall("getBoards", async () => {
      const variables = {
        limit: options.limit,
        page: options.page,
        state: options.state
      };

      const response = await this._executeQuery(BOARD_QUERIES.GET_BOARDS, variables, options);
      const boards = parseGraphQLResponse(response, "boards", options) || [];

      return options.raw ? boards : boards.map(formatBoardData);
    });
  }

  /**
   * Update a board
   * @param {number|string} boardId - Board ID
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.name] - New board name
   * @param {Object} [options={}] - Additional options
   * @param {boolean} [options.raw] - Return raw GraphQL response
   * @returns {Promise<Object>} Updated board object
   */
  async updateBoard(boardId, updates, options = {}) {
    return this._handleApiCall("updateBoard", async () => {
      const validatedId = validateId(boardId, "boardId");
      validateParameters({ updates }, ["updates"]);

      const variables = {
        boardId: validatedId,
        boardName: updates.name
      };

      const response = await this._executeQuery(BOARD_QUERIES.UPDATE_BOARD, variables, options);
      const boardData = parseGraphQLResponse(response, "change_board_name", options);

      return options.raw ? boardData : formatBoardData(boardData);
    });
  }

  /**
   * Delete a board
   * @param {number|string} boardId - Board ID
   * @param {Object} [options={}] - Additional options
   * @param {boolean} [options.raw] - Return raw GraphQL response
   * @returns {Promise<Object>} Deleted board confirmation
   */
  async deleteBoard(boardId, options = {}) {
    return this._handleApiCall("deleteBoard", async () => {
      const validatedId = validateId(boardId, "boardId");

      const variables = {
        boardId: validatedId
      };

      const response = await this._executeQuery(BOARD_QUERIES.DELETE_BOARD, variables, options);
      return parseGraphQLResponse(response, "delete_board", options);
    });
  }
}

module.exports = BoardsModule;
