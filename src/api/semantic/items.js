const { ITEM_QUERIES } = require("./queries/items");
const { parseGraphQLResponse, handleApiError, formatItemData } = require("./utils/response-parser");

/**
 * Semantic API for item operations
 */
class ItemsApi {
  constructor(sdk, isClientSdk = false) {
    this.sdk = sdk;
    this.isClientSdk = isClientSdk;
  }

  /**
   * Create a new item
   * @param {number|string} boardId - Board ID
   * @param {string} name - Item name
   * @param {Object} [columnValues={}] - Column values to set
   * @param {Object} [options={}] - Additional options
   * @returns {Promise<Object>} Created item object
   */
  async createItem(boardId, name, columnValues = {}, options = {}) {
    try {
      const variables = {
        boardId: parseInt(boardId),
        itemName: name,
        columnValues: JSON.stringify(columnValues),
        ...options
      };

      const response = await this.sdk.api(ITEM_QUERIES.CREATE_ITEM, { variables });
      const itemData = parseGraphQLResponse(response, "create_item");
      return formatItemData(itemData);
    } catch (error) {
      throw handleApiError(error, "createItem", { boardId, name, columnValues, options });
    }
  }

  /**
   * Fetch an item by ID
   * @param {number|string} itemId - Item ID
   * @param {Object} [options={}] - Query options
   * @returns {Promise<Object>} Item object
   */
  async fetchItem(itemId, options = {}) {
    try {
      const variables = {
        itemId: parseInt(itemId),
        ...options
      };

      const response = await this.sdk.api(ITEM_QUERIES.GET_ITEM, { variables });
      const items = parseGraphQLResponse(response, "items");
      return items && items.length > 0 ? formatItemData(items[0]) : null;
    } catch (error) {
      throw handleApiError(error, "fetchItem", { itemId, options });
    }
  }

  /**
   * Fetch items from a board
   * @param {number|string} boardId - Board ID
   * @param {Object} [options={}] - Query options
   * @returns {Promise<Array>} Array of item objects
   */
  async fetchItems(boardId, options = {}) {
    try {
      const variables = {
        boardId: parseInt(boardId),
        ...options
      };

      const response = await this.sdk.api(ITEM_QUERIES.GET_ITEMS, { variables });
      const boards = parseGraphQLResponse(response, "boards");
      if (boards && boards.length > 0 && boards[0].items) {
        return boards[0].items.map(formatItemData);
      }
      return [];
    } catch (error) {
      throw handleApiError(error, "fetchItems", { boardId, options });
    }
  }

  /**
   * Update item column values
   * @param {number|string} itemId - Item ID
   * @param {Object} columnValues - Column values to update
   * @param {Object} [options={}] - Additional options
   * @returns {Promise<Object>} Updated item object
   */
  async updateItemColumnValues(itemId, columnValues, options = {}) {
    try {
      const variables = {
        itemId: parseInt(itemId),
        columnValues: JSON.stringify(columnValues),
        ...options
      };

      const response = await this.sdk.api(ITEM_QUERIES.UPDATE_ITEM_COLUMN_VALUES, { variables });
      const itemData = parseGraphQLResponse(response, "change_multiple_column_values");
      return formatItemData(itemData);
    } catch (error) {
      throw handleApiError(error, "updateItemColumnValues", { itemId, columnValues, options });
    }
  }
}

module.exports = ItemsApi;
