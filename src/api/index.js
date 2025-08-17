/**
 * Monday.com Semantic API Layer
 * High-level API for intuitive Monday.com operations
 */

const BoardsAPI = require("./boards");
const ItemsAPI = require("./items");
const ColumnsAPI = require("./columns");

/**
 * Create API instances bound to a specific SDK instance
 * @param {Object} sdkInstance - The Monday SDK instance (client or server)
 * @returns {Object} API layer with boards, items, and columns properties
 */
function createSemanticAPI(sdkInstance) {
  // Ensure the SDK instance has an api method
  if (!sdkInstance || typeof sdkInstance.api !== "function") {
    throw new Error("SDK instance must have an api() method");
  }

  // Bind the API method to each API class
  const api = sdkInstance.api.bind(sdkInstance);

  return {
    /**
     * Boards API for board management operations
     * @type {BoardsAPI}
     */
    boards: new BoardsAPI(api),

    /**
     * Items API for item management operations
     * @type {ItemsAPI}
     */
    items: new ItemsAPI(api),

    /**
     * Columns API for column management operations
     * @type {ColumnsAPI}
     */
    columns: new ColumnsAPI(api)
  };
}

module.exports = {
  createSemanticAPI,
  BoardsAPI,
  ItemsAPI,
  ColumnsAPI
};
