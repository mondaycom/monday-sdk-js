/**
 * ItemsModule - Semantic API for monday.com items operations
 * Provides CRUD operations for items with intuitive method names
 */

const SemanticModule = require("../core/SemanticModule");
const { ITEM_QUERIES } = require("../queries/items");
const { parseGraphQLResponse, formatItemData } = require("../core/ResponseTransformer");
const { ItemError } = require("../core/SemanticError");

class ItemsModule extends SemanticModule {
  static get name() {
    return "items";
  }

  static get version() {
    return "1.0.0";
  }

  static get dependencies() {
    return [];
  }

  /**
   * Create a new item in a board
   * @param {number} boardId - ID of the board to create the item in
   * @param {string} name - Name of the item
   * @param {Object} options - Additional options
   * @param {string} options.group_id - Group to create the item in
   * @param {Object} options.column_values - Initial column values
   * @param {boolean} options.create_labels_if_missing - Create labels if they don't exist
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @param {boolean} options.rawErrors - Return raw GraphQL errors
   * @returns {Promise<Object>} Created item data
   */
  async createItem(boardId, name, options = {}) {
    return this._handleApiCall(
      "createItem",
      async () => {
        // Validate inputs
        if (!Number.isInteger(boardId) || boardId <= 0) {
          throw new ItemError("Board ID must be a positive integer", null, "createItem", { boardId });
        }

        if (!name || typeof name !== "string" || name.trim().length === 0) {
          throw new ItemError("Item name is required and must be a non-empty string", null, "createItem", { name });
        }

        const variables = {
          board_id: boardId,
          item_name: name.trim()
        };

        // Add optional parameters
        if (options.group_id) {
          variables.group_id = options.group_id;
        }

        if (options.column_values && typeof options.column_values === "object") {
          variables.column_values = JSON.stringify(options.column_values);
        }

        if (options.create_labels_if_missing) {
          variables.create_labels_if_missing = options.create_labels_if_missing;
        }

        const response = await this._executeQuery(ITEM_QUERIES.CREATE_ITEM, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const itemData = parseGraphQLResponse(response, "create_item", options);
        if (!itemData) {
          throw new ItemError("Item creation failed - no data returned", null, "createItem", { boardId, name });
        }

        return {
          item: formatItemData(itemData)
        };
      },
      { boardId, itemName: name, isClientSdk: this.isClientSdk }
    );
  }

  /**
   * Get a specific item by ID
   * @param {number} itemId - ID of the item to retrieve
   * @param {Object} options - Additional options
   * @param {boolean} options.includeColumnValues - Include column values in response
   * @param {boolean} options.includeBoard - Include board information
   * @param {boolean} options.includeGroup - Include group information
   * @param {boolean} options.includeCreator - Include creator information
   * @param {boolean} options.includeSubscribers - Include subscribers
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Item data
   */
  async getItem(itemId, options = {}) {
    return this._handleApiCall(
      "getItem",
      async () => {
        // Validate inputs
        if (!Number.isInteger(itemId) || itemId <= 0) {
          throw new ItemError("Item ID must be a positive integer", null, "getItem", { itemId });
        }

        const variables = {
          item_id: itemId
        };

        const response = await this._executeQuery(ITEM_QUERIES.GET_ITEM, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const itemsData = parseGraphQLResponse(response, "items", options);
        if (!itemsData || itemsData.length === 0) {
          throw new ItemError("Item not found", null, "getItem", { itemId });
        }

        return {
          item: formatItemData(itemsData[0])
        };
      },
      { itemId, isClientSdk: this.isClientSdk }
    );
  }

  /**
   * Get multiple items from a board
   * @param {number} boardId - ID of the board to get items from
   * @param {Object} options - Additional options
   * @param {number} options.limit - Maximum number of items to return
   * @param {number} options.page - Page number for pagination
   * @param {string} options.state - Filter by item state ('active', 'archived', 'deleted', 'all')
   * @param {boolean} options.includeColumnValues - Include column values in response
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Items data
   */
  async getItems(boardId, options = {}) {
    return this._handleApiCall(
      "getItems",
      async () => {
        // Validate inputs
        if (!Number.isInteger(boardId) || boardId <= 0) {
          throw new ItemError("Board ID must be a positive integer", null, "getItems", { boardId });
        }

        const variables = {
          board_id: boardId
        };

        // Add optional filters
        if (options.limit && Number.isInteger(options.limit) && options.limit > 0) {
          variables.limit = options.limit;
        }

        if (options.page && Number.isInteger(options.page) && options.page > 0) {
          variables.page = options.page;
        }

        if (options.state && ["active", "archived", "deleted", "all"].includes(options.state)) {
          variables.state = options.state;
        }

        const response = await this._executeQuery(ITEM_QUERIES.GET_ITEMS, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const boardsData = parseGraphQLResponse(response, "boards", options);
        if (!boardsData || boardsData.length === 0) {
          throw new ItemError("Board not found", null, "getItems", { boardId });
        }

        const itemsData = boardsData[0].items || [];

        return {
          items: itemsData.map(formatItemData),
          total_count: itemsData.length
        };
      },
      { boardId, isClientSdk: this.isClientSdk }
    );
  }

  /**
   * Update column values for an item
   * @param {number} itemId - ID of the item to update
   * @param {Object} columnValues - Column values to update
   * @param {Object} options - Additional options
   * @param {boolean} options.create_labels_if_missing - Create labels if they don't exist
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Updated item data
   */
  async updateItemColumnValues(itemId, columnValues, options = {}) {
    return this._handleApiCall(
      "updateItemColumnValues",
      async () => {
        // Validate inputs
        if (!Number.isInteger(itemId) || itemId <= 0) {
          throw new ItemError("Item ID must be a positive integer", null, "updateItemColumnValues", { itemId });
        }

        if (!columnValues || typeof columnValues !== "object" || Object.keys(columnValues).length === 0) {
          throw new ItemError("Column values must be provided and cannot be empty", null, "updateItemColumnValues", {
            itemId
          });
        }

        const variables = {
          item_id: itemId,
          column_values: JSON.stringify(columnValues)
        };

        if (options.create_labels_if_missing) {
          variables.create_labels_if_missing = options.create_labels_if_missing;
        }

        const response = await this._executeQuery(ITEM_QUERIES.UPDATE_ITEM_COLUMN_VALUES, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const itemData = parseGraphQLResponse(response, "change_multiple_column_values", options);
        if (!itemData) {
          throw new ItemError("Item column values update failed - no data returned", null, "updateItemColumnValues", {
            itemId
          });
        }

        return {
          item: formatItemData(itemData)
        };
      },
      { itemId, columnValues, isClientSdk: this.isClientSdk }
    );
  }

  /**
   * Delete an item
   * @param {number} itemId - ID of the item to delete
   * @param {Object} options - Additional options
   * @param {boolean} options.permanent - Whether to permanently delete (vs archive)
   * @param {boolean} options.rawResponse - Return raw GraphQL response
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteItem(itemId, options = {}) {
    return this._handleApiCall(
      "deleteItem",
      async () => {
        // Validate inputs
        if (!Number.isInteger(itemId) || itemId <= 0) {
          throw new ItemError("Item ID must be a positive integer", null, "deleteItem", { itemId });
        }

        const variables = {
          item_id: itemId
        };

        const response = await this._executeQuery(ITEM_QUERIES.DELETE_ITEM, variables, options);

        if (options.rawResponse) {
          return response;
        }

        const deletionData = parseGraphQLResponse(response, "delete_item", options);
        if (!deletionData) {
          throw new ItemError("Item deletion failed - no confirmation returned", null, "deleteItem", { itemId });
        }

        return {
          success: true,
          item_id: parseInt(deletionData.id),
          warnings: []
        };
      },
      { itemId, isClientSdk: this.isClientSdk }
    );
  }
}

module.exports = ItemsModule;
