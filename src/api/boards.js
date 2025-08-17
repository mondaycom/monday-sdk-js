/**
 * Monday.com Boards API
 * High-level semantic API for board operations
 */

/**
 * Default board fields for queries
 */
const DEFAULT_BOARD_FIELDS = `
  id
  name
  description
  state
  board_kind
  board_folder_id
  workspace_id
  created_at
  updated_at
  owners {
    id
    name
    email
  }
`;

/**
 * Extended board fields including columns and groups
 */
const EXTENDED_BOARD_FIELDS = `
  ${DEFAULT_BOARD_FIELDS}
  columns {
    id
    title
    type
    settings_str
    archived
  }
  groups {
    id
    title
    color
    position
    archived
  }
`;

class BoardsAPI {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Create a new board
   * @param {string} name - Board name
   * @param {string} [boardKind='public'] - Board kind (public, private, share)
   * @param {Object} [options={}] - Additional options
   * @param {string} [options.description] - Board description
   * @param {number} [options.folderId] - Board folder ID
   * @param {number} [options.workspaceId] - Workspace ID
   * @param {string} [options.templateId] - Template ID to create from
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Created board data
   */
  async createBoard(name, boardKind = "public", options = {}) {
    if (!name || typeof name !== "string") {
      throw new Error("Board name is required and must be a string");
    }

    const variables = {
      boardName: name,
      boardKind: boardKind
    };

    if (options.description) variables.description = options.description;
    if (options.folderId) variables.folderId = options.folderId;
    if (options.workspaceId) variables.workspaceId = options.workspaceId;
    if (options.templateId) variables.templateId = options.templateId;

    const fields = options.fields ? options.fields.join("\n  ") : DEFAULT_BOARD_FIELDS;

    const query = `
      mutation CreateBoard(
        $boardName: String!
        $boardKind: BoardKind!
        ${options.description ? "$description: String" : ""}
        ${options.folderId ? "$folderId: ID" : ""}
        ${options.workspaceId ? "$workspaceId: ID" : ""}
        ${options.templateId ? "$templateId: ID" : ""}
      ) {
        create_board(
          board_name: $boardName
          board_kind: $boardKind
          ${options.description ? "description: $description" : ""}
          ${options.folderId ? "board_folder_id: $folderId" : ""}
          ${options.workspaceId ? "workspace_id: $workspaceId" : ""}
          ${options.templateId ? "template_id: $templateId" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.create_board;
  }

  /**
   * Get a single board by ID
   * @param {string|number} boardId - Board ID
   * @param {Object} [options={}] - Query options
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @param {boolean} [options.includeColumns=false] - Include columns data
   * @param {boolean} [options.includeGroups=false] - Include groups data
   * @returns {Promise<Object>} Board data
   */
  async getBoard(boardId, options = {}) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    const variables = { boardId: String(boardId) };

    let fields = DEFAULT_BOARD_FIELDS;
    if (options.includeColumns || options.includeGroups || options.fields) {
      fields = options.fields ? options.fields.join("\n  ") : EXTENDED_BOARD_FIELDS;
    }

    const query = `
      query GetBoard($boardId: ID!) {
        boards(ids: [$boardId]) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    const boards = response.data?.boards;
    return boards && boards.length > 0 ? boards[0] : null;
  }

  /**
   * Get multiple boards
   * @param {Object} [options={}] - Query options
   * @param {Array<string|number>} [options.ids] - Specific board IDs to fetch
   * @param {number} [options.limit] - Limit number of boards
   * @param {number} [options.page] - Page number for pagination
   * @param {string} [options.order_by] - Order by field
   * @param {string} [options.state] - Board state filter (active, archived, deleted)
   * @param {number} [options.workspaceId] - Filter by workspace ID
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @param {boolean} [options.includeColumns=false] - Include columns data
   * @param {boolean} [options.includeGroups=false] - Include groups data
   * @returns {Promise<Array<Object>>} Array of board data
   */
  async getBoards(options = {}) {
    const variables = {};

    if (options.ids) variables.ids = options.ids.map(String);
    if (options.limit) variables.limit = options.limit;
    if (options.page) variables.page = options.page;
    if (options.order_by) variables.order_by = options.order_by;
    if (options.state) variables.state = options.state;
    if (options.workspaceId) variables.workspaceId = options.workspaceId;

    let fields = DEFAULT_BOARD_FIELDS;
    if (options.includeColumns || options.includeGroups || options.fields) {
      fields = options.fields ? options.fields.join("\n  ") : EXTENDED_BOARD_FIELDS;
    }

    const query = `
      query GetBoards(
        ${options.ids ? "$ids: [ID!]" : ""}
        ${options.limit ? "$limit: Int" : ""}
        ${options.page ? "$page: Int" : ""}
        ${options.order_by ? "$order_by: BoardsOrderBy" : ""}
        ${options.state ? "$state: State" : ""}
        ${options.workspaceId ? "$workspaceId: ID" : ""}
      ) {
        boards(
          ${options.ids ? "ids: $ids" : ""}
          ${options.limit ? "limit: $limit" : ""}
          ${options.page ? "page: $page" : ""}
          ${options.order_by ? "order_by: $order_by" : ""}
          ${options.state ? "state: $state" : ""}
          ${options.workspaceId ? "workspace_ids: [$workspaceId]" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.boards || [];
  }

  /**
   * Update board properties
   * @param {string|number} boardId - Board ID
   * @param {Object} updates - Update properties
   * @param {string} [updates.name] - New board name
   * @param {string} [updates.description] - New board description
   * @param {Array<string>} [updates.fields] - Custom fields to return
   * @returns {Promise<Object>} Updated board data
   */
  async updateBoard(boardId, updates) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("Updates object cannot be empty");
    }

    const variables = { boardId: String(boardId) };
    const mutations = [];

    if (updates.name) {
      variables.name = updates.name;
      mutations.push("update_board(board_id: $boardId, board_attribute: name, new_value: $name) { id }");
    }

    if (updates.description) {
      variables.description = updates.description;
      mutations.push("update_board(board_id: $boardId, board_attribute: description, new_value: $description) { id }");
    }

    if (mutations.length === 0) {
      throw new Error("No valid update properties provided");
    }

    const fields = updates.fields ? updates.fields.join("\n  ") : DEFAULT_BOARD_FIELDS;

    const query = `
      mutation UpdateBoard(
        $boardId: ID!
        ${updates.name ? "$name: String!" : ""}
        ${updates.description ? "$description: String!" : ""}
      ) {
        ${mutations.join("\n        ")}
        
        boards(ids: [$boardId]) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    const boards = response.data?.boards;
    return boards && boards.length > 0 ? boards[0] : null;
  }

  /**
   * Archive/delete a board
   * @param {string|number} boardId - Board ID
   * @returns {Promise<Object>} Archived board data
   */
  async deleteBoard(boardId) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    const variables = { boardId: String(boardId) };

    const query = `
      mutation DeleteBoard($boardId: ID!) {
        archive_board(board_id: $boardId) {
          id
          state
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.archive_board;
  }

  /**
   * Duplicate an existing board
   * @param {string|number} boardId - Source board ID
   * @param {Object} [options={}] - Duplication options
   * @param {string} [options.boardName] - Name for duplicated board
   * @param {boolean} [options.duplicateType='duplicate_board_with_structure'] - Duplication type
   * @param {number} [options.workspaceId] - Target workspace ID
   * @param {number} [options.folderId] - Target folder ID
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Duplicated board data
   */
  async duplicateBoard(boardId, options = {}) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    const variables = {
      boardId: String(boardId),
      duplicateType: options.duplicateType || "duplicate_board_with_structure"
    };

    if (options.boardName) variables.boardName = options.boardName;
    if (options.workspaceId) variables.workspaceId = options.workspaceId;
    if (options.folderId) variables.folderId = options.folderId;

    const fields = options.fields ? options.fields.join("\n  ") : DEFAULT_BOARD_FIELDS;

    const query = `
      mutation DuplicateBoard(
        $boardId: ID!
        $duplicateType: DuplicateBoardType!
        ${options.boardName ? "$boardName: String" : ""}
        ${options.workspaceId ? "$workspaceId: ID" : ""}
        ${options.folderId ? "$folderId: ID" : ""}
      ) {
        duplicate_board(
          board_id: $boardId
          duplicate_type: $duplicateType
          ${options.boardName ? "board_name: $boardName" : ""}
          ${options.workspaceId ? "workspace_id: $workspaceId" : ""}
          ${options.folderId ? "folder_id: $folderId" : ""}
        ) {
          board {
            ${fields}
          }
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.duplicate_board?.board;
  }

  /**
   * Get board activity/updates
   * @param {string|number} boardId - Board ID
   * @param {Object} [options={}] - Query options
   * @param {number} [options.limit] - Limit number of updates
   * @param {number} [options.page] - Page number for pagination
   * @returns {Promise<Array<Object>>} Board updates
   */
  async getBoardActivity(boardId, options = {}) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    const variables = { boardId: String(boardId) };
    if (options.limit) variables.limit = options.limit;
    if (options.page) variables.page = options.page;

    const query = `
      query GetBoardActivity(
        $boardId: ID!
        ${options.limit ? "$limit: Int" : ""}
        ${options.page ? "$page: Int" : ""}
      ) {
        boards(ids: [$boardId]) {
          updates(
            ${options.limit ? "limit: $limit" : ""}
            ${options.page ? "page: $page" : ""}
          ) {
            id
            body
            created_at
            updated_at
            creator {
              id
              name
              email
            }
          }
        }
      }
    `;

    const response = await this.api(query, { variables });
    const boards = response.data?.boards;
    return boards && boards.length > 0 ? boards[0].updates || [] : [];
  }
}

module.exports = BoardsAPI;
