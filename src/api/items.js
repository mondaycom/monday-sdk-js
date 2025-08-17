/**
 * Monday.com Items API
 * High-level semantic API for item operations
 */

/**
 * Default item fields for queries
 */
const DEFAULT_ITEM_FIELDS = `
  id
  name
  state
  created_at
  updated_at
  creator_id
  board {
    id
    name
  }
  group {
    id
    title
  }
`;

/**
 * Extended item fields including column values
 */
const EXTENDED_ITEM_FIELDS = `
  ${DEFAULT_ITEM_FIELDS}
  column_values {
    id
    type
    title
    text
    value
    additional_info
  }
`;

/**
 * Item fields with subitems
 */
const ITEM_WITH_SUBITEMS_FIELDS = `
  ${EXTENDED_ITEM_FIELDS}
  subitems {
    id
    name
    column_values {
      id
      type
      title
      text
      value
    }
  }
`;

class ItemsAPI {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Create a new item
   * @param {string|number} boardId - Board ID
   * @param {string} itemName - Item name
   * @param {Object} [columnValues={}] - Initial column values
   * @param {Object} [options={}] - Additional options
   * @param {string} [options.groupId] - Group ID to create item in
   * @param {string} [options.createLabelsIfMissing=false] - Create labels if missing
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Created item data
   */
  async createItem(boardId, itemName, columnValues = {}, options = {}) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    if (!itemName || typeof itemName !== "string") {
      throw new Error("Item name is required and must be a string");
    }

    const variables = {
      boardId: String(boardId),
      itemName: itemName
    };

    if (Object.keys(columnValues).length > 0) {
      variables.columnValues = JSON.stringify(columnValues);
    }

    if (options.groupId) variables.groupId = options.groupId;
    if (options.createLabelsIfMissing) variables.createLabelsIfMissing = options.createLabelsIfMissing;

    const fields = options.fields ? options.fields.join("\n  ") : DEFAULT_ITEM_FIELDS;

    const query = `
      mutation CreateItem(
        $boardId: ID!
        $itemName: String!
        ${Object.keys(columnValues).length > 0 ? "$columnValues: JSON" : ""}
        ${options.groupId ? "$groupId: String" : ""}
        ${options.createLabelsIfMissing ? "$createLabelsIfMissing: Boolean" : ""}
      ) {
        create_item(
          board_id: $boardId
          item_name: $itemName
          ${Object.keys(columnValues).length > 0 ? "column_values: $columnValues" : ""}
          ${options.groupId ? "group_id: $groupId" : ""}
          ${options.createLabelsIfMissing ? "create_labels_if_missing: $createLabelsIfMissing" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.create_item;
  }

  /**
   * Get a single item by ID
   * @param {string|number} itemId - Item ID
   * @param {Object} [options={}] - Query options
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @param {boolean} [options.includeColumnValues=false] - Include column values
   * @param {boolean} [options.includeSubitems=false] - Include subitems
   * @returns {Promise<Object>} Item data
   */
  async getItem(itemId, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    const variables = { itemId: String(itemId) };

    let fields = DEFAULT_ITEM_FIELDS;
    if (options.includeSubitems) {
      fields = ITEM_WITH_SUBITEMS_FIELDS;
    } else if (options.includeColumnValues || options.fields) {
      fields = options.fields ? options.fields.join("\n  ") : EXTENDED_ITEM_FIELDS;
    }

    const query = `
      query GetItem($itemId: ID!) {
        items(ids: [$itemId]) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    const items = response.data?.items;
    return items && items.length > 0 ? items[0] : null;
  }

  /**
   * Get multiple items
   * @param {string|number} [boardId] - Board ID to filter by
   * @param {Object} [options={}] - Query options
   * @param {Array<string|number>} [options.ids] - Specific item IDs to fetch
   * @param {number} [options.limit] - Limit number of items
   * @param {number} [options.page] - Page number for pagination
   * @param {string} [options.newest_first] - Order by newest first
   * @param {string} [options.exclude_nonactive] - Exclude non-active items
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @param {boolean} [options.includeColumnValues=false] - Include column values
   * @param {boolean} [options.includeSubitems=false] - Include subitems
   * @returns {Promise<Array<Object>>} Array of item data
   */
  async getItems(boardId, options = {}) {
    const variables = {};

    if (boardId) variables.boardId = String(boardId);
    if (options.ids) variables.ids = options.ids.map(String);
    if (options.limit) variables.limit = options.limit;
    if (options.page) variables.page = options.page;
    if (options.newest_first) variables.newest_first = options.newest_first;
    if (options.exclude_nonactive) variables.exclude_nonactive = options.exclude_nonactive;

    let fields = DEFAULT_ITEM_FIELDS;
    if (options.includeSubitems) {
      fields = ITEM_WITH_SUBITEMS_FIELDS;
    } else if (options.includeColumnValues || options.fields) {
      fields = options.fields ? options.fields.join("\n  ") : EXTENDED_ITEM_FIELDS;
    }

    const query = `
      query GetItems(
        ${boardId ? "$boardId: ID" : ""}
        ${options.ids ? "$ids: [ID!]" : ""}
        ${options.limit ? "$limit: Int" : ""}
        ${options.page ? "$page: Int" : ""}
        ${options.newest_first ? "$newest_first: Boolean" : ""}
        ${options.exclude_nonactive ? "$exclude_nonactive: Boolean" : ""}
      ) {
        ${
          boardId
            ? `
          boards(ids: [$boardId]) {
            items_page(
              ${options.limit ? "limit: $limit" : ""}
              ${options.page ? "page: $page" : ""}
            ) {
              items {
                ${fields}
              }
            }
          }
        `
            : `
          items(
            ${options.ids ? "ids: $ids" : ""}
            ${options.limit ? "limit: $limit" : ""}
            ${options.page ? "page: $page" : ""}
            ${options.newest_first ? "newest_first: $newest_first" : ""}
            ${options.exclude_nonactive ? "exclude_nonactive: $exclude_nonactive" : ""}
          ) {
            ${fields}
          }
        `
        }
      }
    `;

    const response = await this.api(query, { variables });

    if (boardId) {
      const boards = response.data?.boards;
      return boards && boards.length > 0 ? boards[0].items_page?.items || [] : [];
    } else {
      return response.data?.items || [];
    }
  }

  /**
   * Update item properties
   * @param {string|number} itemId - Item ID
   * @param {Object} updates - Update properties
   * @param {string} [updates.name] - New item name
   * @param {Array<string>} [updates.fields] - Custom fields to return
   * @returns {Promise<Object>} Updated item data
   */
  async updateItem(itemId, updates) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("Updates object cannot be empty");
    }

    if (!updates.name) {
      throw new Error("Item name is required for updates");
    }

    const variables = {
      itemId: String(itemId),
      itemName: updates.name
    };

    const fields = updates.fields ? updates.fields.join("\n  ") : DEFAULT_ITEM_FIELDS;

    const query = `
      mutation UpdateItem($itemId: ID!, $itemName: String!) {
        change_simple_column_value(
          item_id: $itemId
          column_id: "name"
          value: $itemName
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.change_simple_column_value;
  }

  /**
   * Delete an item
   * @param {string|number} itemId - Item ID
   * @returns {Promise<Object>} Deleted item data
   */
  async deleteItem(itemId) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    const variables = { itemId: String(itemId) };

    const query = `
      mutation DeleteItem($itemId: ID!) {
        delete_item(item_id: $itemId) {
          id
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.delete_item;
  }

  /**
   * Duplicate an item
   * @param {string|number} itemId - Source item ID
   * @param {Object} [options={}] - Duplication options
   * @param {string|number} [options.boardId] - Target board ID
   * @param {boolean} [options.withUpdates=false] - Include updates in duplication
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Duplicated item data
   */
  async duplicateItem(itemId, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    const variables = { itemId: String(itemId) };

    if (options.boardId) variables.boardId = String(options.boardId);
    if (options.withUpdates !== undefined) variables.withUpdates = options.withUpdates;

    const fields = options.fields ? options.fields.join("\n  ") : DEFAULT_ITEM_FIELDS;

    const query = `
      mutation DuplicateItem(
        $itemId: ID!
        ${options.boardId ? "$boardId: ID" : ""}
        ${options.withUpdates !== undefined ? "$withUpdates: Boolean" : ""}
      ) {
        duplicate_item(
          item_id: $itemId
          ${options.boardId ? "board_id: $boardId" : ""}
          ${options.withUpdates !== undefined ? "with_updates: $withUpdates" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.duplicate_item;
  }

  /**
   * Move item to another board
   * @param {string|number} itemId - Item ID
   * @param {string|number} targetBoardId - Target board ID
   * @param {string} [groupId] - Target group ID
   * @param {Array<string>} [fields] - Custom fields to return
   * @returns {Promise<Object>} Moved item data
   */
  async moveItemToBoard(itemId, targetBoardId, groupId, fields) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    if (!targetBoardId) {
      throw new Error("Target board ID is required");
    }

    const variables = {
      itemId: String(itemId),
      boardId: String(targetBoardId)
    };

    if (groupId) variables.groupId = groupId;

    const responseFields = fields ? fields.join("\n  ") : DEFAULT_ITEM_FIELDS;

    const query = `
      mutation MoveItemToBoard(
        $itemId: ID!
        $boardId: ID!
        ${groupId ? "$groupId: String" : ""}
      ) {
        move_item_to_board(
          item_id: $itemId
          board_id: $boardId
          ${groupId ? "group_id: $groupId" : ""}
        ) {
          ${responseFields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.move_item_to_board;
  }

  /**
   * Update multiple column values for an item
   * @param {string|number} itemId - Item ID
   * @param {Object} columnValues - Column values to update (key-value pairs)
   * @param {Object} [options={}] - Additional options
   * @param {boolean} [options.createLabelsIfMissing=false] - Create labels if missing
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Updated item data
   */
  async updateItemColumnValues(itemId, columnValues, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    if (!columnValues || Object.keys(columnValues).length === 0) {
      throw new Error("Column values object cannot be empty");
    }

    const variables = {
      itemId: String(itemId),
      columnValues: JSON.stringify(columnValues)
    };

    if (options.createLabelsIfMissing) variables.createLabelsIfMissing = options.createLabelsIfMissing;

    const fields = options.fields ? options.fields.join("\n  ") : EXTENDED_ITEM_FIELDS;

    const query = `
      mutation UpdateItemColumnValues(
        $itemId: ID!
        $columnValues: JSON!
        ${options.createLabelsIfMissing ? "$createLabelsIfMissing: Boolean" : ""}
      ) {
        change_multiple_column_values(
          item_id: $itemId
          column_values: $columnValues
          ${options.createLabelsIfMissing ? "create_labels_if_missing: $createLabelsIfMissing" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.change_multiple_column_values;
  }

  /**
   * Archive an item
   * @param {string|number} itemId - Item ID
   * @returns {Promise<Object>} Archived item data
   */
  async archiveItem(itemId) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    const variables = { itemId: String(itemId) };

    const query = `
      mutation ArchiveItem($itemId: ID!) {
        archive_item(item_id: $itemId) {
          id
          state
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.archive_item;
  }

  /**
   * Create a subitem
   * @param {string|number} parentItemId - Parent item ID
   * @param {string} itemName - Subitem name
   * @param {Object} [columnValues={}] - Initial column values
   * @param {Object} [options={}] - Additional options
   * @param {boolean} [options.createLabelsIfMissing=false] - Create labels if missing
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Created subitem data
   */
  async createSubitem(parentItemId, itemName, columnValues = {}, options = {}) {
    if (!parentItemId) {
      throw new Error("Parent item ID is required");
    }

    if (!itemName || typeof itemName !== "string") {
      throw new Error("Subitem name is required and must be a string");
    }

    const variables = {
      parentItemId: String(parentItemId),
      itemName: itemName
    };

    if (Object.keys(columnValues).length > 0) {
      variables.columnValues = JSON.stringify(columnValues);
    }

    if (options.createLabelsIfMissing) variables.createLabelsIfMissing = options.createLabelsIfMissing;

    const fields = options.fields ? options.fields.join("\n  ") : DEFAULT_ITEM_FIELDS;

    const query = `
      mutation CreateSubitem(
        $parentItemId: ID!
        $itemName: String!
        ${Object.keys(columnValues).length > 0 ? "$columnValues: JSON" : ""}
        ${options.createLabelsIfMissing ? "$createLabelsIfMissing: Boolean" : ""}
      ) {
        create_subitem(
          parent_item_id: $parentItemId
          item_name: $itemName
          ${Object.keys(columnValues).length > 0 ? "column_values: $columnValues" : ""}
          ${options.createLabelsIfMissing ? "create_labels_if_missing: $createLabelsIfMissing" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.create_subitem;
  }

  /**
   * Get item's activity/updates
   * @param {string|number} itemId - Item ID
   * @param {Object} [options={}] - Query options
   * @param {number} [options.limit] - Limit number of updates
   * @param {number} [options.page] - Page number for pagination
   * @returns {Promise<Array<Object>>} Item updates
   */
  async getItemActivity(itemId, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    const variables = { itemId: String(itemId) };
    if (options.limit) variables.limit = options.limit;
    if (options.page) variables.page = options.page;

    const query = `
      query GetItemActivity(
        $itemId: ID!
        ${options.limit ? "$limit: Int" : ""}
        ${options.page ? "$page: Int" : ""}
      ) {
        items(ids: [$itemId]) {
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
    const items = response.data?.items;
    return items && items.length > 0 ? items[0].updates || [] : [];
  }
}

module.exports = ItemsAPI;
