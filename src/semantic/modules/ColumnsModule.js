/**
 * ColumnsModule - Semantic API for monday.com columns operations
 * Provides CRUD operations for columns with intuitive method names
 */

const SemanticModule = require("../core/SemanticModule");
const { COLUMN_QUERIES } = require("../queries/columns");
const { parseGraphQLResponse, formatColumnData } = require("../core/ResponseTransformer");
const { ColumnError } = require("../core/SemanticError");

class ColumnsModule extends SemanticModule {
  static get name() {
    return "columns";
  }

  static get version() {
    return "1.0.0";
  }

  static get dependencies() {
    return [];
  }

  /**
   * Get all columns for a board
   * @param {number} boardId - ID of the board to get columns from
   * @param {Object} options - Additional options
   * @param {boolean} options.includeSettings - Include column settings in response
   * @param {boolean} options.includeArchived - Include archived columns
   * @param {Array<string>} options.columnTypes - Filter by specific column types
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Columns data
   */
  async getColumns(boardId, options = {}) {
    return this._handleApiCall(
      "getColumns",
      async () => {
        // Validate inputs
        if (!Number.isInteger(boardId) || boardId <= 0) {
          throw new ColumnError("Board ID must be a positive integer", null, "getColumns", { boardId });
        }

        const variables = {
          board_id: boardId
        };

        const response = await this._executeQuery(COLUMN_QUERIES.GET_COLUMNS, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const boardsData = parseGraphQLResponse(response, "boards", options);
        if (!boardsData || boardsData.length === 0) {
          throw new ColumnError("Board not found", null, "getColumns", { boardId });
        }

        const columnsData = boardsData[0].columns || [];

        // Filter by column types if specified
        let filteredColumns = columnsData;
        if (options.columnTypes && Array.isArray(options.columnTypes)) {
          filteredColumns = columnsData.filter(col => options.columnTypes.includes(col.type));
        }

        // Filter archived columns if not requested
        if (!options.includeArchived) {
          filteredColumns = filteredColumns.filter(col => !col.archived);
        }

        return {
          columns: filteredColumns.map(formatColumnData),
          warnings: []
        };
      },
      { boardId, isClientSdk: this.isClientSdk }
    );
  }

  /**
   * Create a new column in a board
   * @param {number} boardId - ID of the board to create the column in
   * @param {string} title - Title of the column
   * @param {string} columnType - Type of the column
   * @param {Object} options - Additional options
   * @param {string} options.description - Column description
   * @param {Object} options.defaults - Default values/settings for the column
   * @param {string} options.after_column_id - ID of column to insert after
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Created column data
   */
  async createColumn(boardId, title, columnType, options = {}) {
    return this._handleApiCall(
      "createColumn",
      async () => {
        // Validate inputs
        if (!Number.isInteger(boardId) || boardId <= 0) {
          throw new ColumnError("Board ID must be a positive integer", null, "createColumn", { boardId });
        }

        if (!title || typeof title !== "string" || title.trim().length === 0) {
          throw new ColumnError("Column title is required and must be a non-empty string", null, "createColumn", {
            title
          });
        }

        if (!columnType || typeof columnType !== "string") {
          throw new ColumnError("Column type is required and must be a string", null, "createColumn", { columnType });
        }

        // Validate column type against known types
        const validTypes = [
          "text",
          "numbers",
          "status",
          "date",
          "people",
          "timeline",
          "email",
          "phone",
          "link",
          "rating",
          "checkbox",
          "location",
          "file",
          "tags",
          "dropdown",
          "long_text",
          "auto_number",
          "creation_log",
          "last_updated"
        ];

        if (!validTypes.includes(columnType)) {
          throw new ColumnError(
            `Invalid column type: ${columnType}. Must be one of: ${validTypes.join(", ")}`,
            null,
            "createColumn",
            { columnType }
          );
        }

        const variables = {
          board_id: boardId,
          column_type: columnType,
          title: title.trim()
        };

        // Add optional parameters
        if (options.description) {
          variables.description = options.description;
        }

        if (options.defaults && typeof options.defaults === "object") {
          variables.defaults = JSON.stringify(options.defaults);
        }

        if (options.after_column_id) {
          variables.after_column_id = options.after_column_id;
        }

        const response = await this._executeQuery(COLUMN_QUERIES.CREATE_COLUMN, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const columnData = parseGraphQLResponse(response, "create_column", options);
        if (!columnData) {
          throw new ColumnError("Column creation failed - no data returned", null, "createColumn", {
            boardId,
            title,
            columnType
          });
        }

        return {
          column: formatColumnData(columnData)
        };
      },
      { boardId, title, columnType, isClientSdk: this.isClientSdk }
    );
  }

  /**
   * Update an existing column
   * @param {number} boardId - ID of the board containing the column
   * @param {string} columnId - ID of the column to update
   * @param {Object} updates - Fields to update
   * @param {string} updates.title - New column title
   * @param {string} updates.description - New column description
   * @param {Object} options - Additional options
   * @param {boolean} options.archive - Whether to archive the column
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Updated column data
   */
  async updateColumn(boardId, columnId, updates, options = {}) {
    return this._handleApiCall(
      "updateColumn",
      async () => {
        // Validate inputs
        if (!Number.isInteger(boardId) || boardId <= 0) {
          throw new ColumnError("Board ID must be a positive integer", null, "updateColumn", { boardId });
        }

        if (!columnId || typeof columnId !== "string") {
          throw new ColumnError("Column ID is required and must be a string", null, "updateColumn", { columnId });
        }

        if (!updates || typeof updates !== "object" || Object.keys(updates).length === 0) {
          throw new ColumnError("At least one field must be provided for update", null, "updateColumn", { columnId });
        }

        const variables = {
          board_id: boardId,
          column_id: columnId
        };

        // Add update fields
        if (updates.title !== undefined) {
          variables.title = String(updates.title);
        }

        if (updates.description !== undefined) {
          variables.description = String(updates.description);
        }

        const response = await this._executeQuery(COLUMN_QUERIES.UPDATE_COLUMN, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const columnData = parseGraphQLResponse(response, "change_column_title", options);
        if (!columnData) {
          throw new ColumnError("Column update failed - no data returned", null, "updateColumn", { boardId, columnId });
        }

        return {
          column: formatColumnData(columnData)
        };
      },
      { boardId, columnId, updates, isClientSdk: this.isClientSdk }
    );
  }

  /**
   * Delete a column
   * @param {number} boardId - ID of the board containing the column
   * @param {string} columnId - ID of the column to delete
   * @param {Object} options - Additional options
   * @param {boolean} options.permanent - Whether to permanently delete (vs archive)
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteColumn(boardId, columnId, options = {}) {
    return this._handleApiCall(
      "deleteColumn",
      async () => {
        // Validate inputs
        if (!Number.isInteger(boardId) || boardId <= 0) {
          throw new ColumnError("Board ID must be a positive integer", null, "deleteColumn", { boardId });
        }

        if (!columnId || typeof columnId !== "string") {
          throw new ColumnError("Column ID is required and must be a string", null, "deleteColumn", { columnId });
        }

        const variables = {
          board_id: boardId,
          column_id: columnId
        };

        const response = await this._executeQuery(COLUMN_QUERIES.DELETE_COLUMN, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const deletionData = parseGraphQLResponse(response, "delete_column", options);
        if (!deletionData) {
          throw new ColumnError("Column deletion failed - no confirmation returned", null, "deleteColumn", {
            boardId,
            columnId
          });
        }

        return {
          success: true,
          column_id: deletionData.id,
          warnings: []
        };
      },
      { boardId, columnId, isClientSdk: this.isClientSdk }
    );
  }
}

module.exports = ColumnsModule;
