/**
 * Monday.com Columns API
 * High-level semantic API for column operations
 */

/**
 * Default column fields for queries
 */
const DEFAULT_COLUMN_FIELDS = `
  id
  title
  type
  description
  settings_str
  archived
  width
  pos
`;

/**
 * Extended column fields with board information
 */
const EXTENDED_COLUMN_FIELDS = `
  ${DEFAULT_COLUMN_FIELDS}
  board {
    id
    name
  }
`;

class ColumnsAPI {
  constructor(apiClient) {
    this.api = apiClient;
  }

  /**
   * Get columns for a board
   * @param {string|number} boardId - Board ID
   * @param {Object} [options={}] - Query options
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @param {Array<string>} [options.types] - Filter by column types
   * @param {boolean} [options.includeArchived=false] - Include archived columns
   * @returns {Promise<Array<Object>>} Array of column data
   */
  async getColumns(boardId, options = {}) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    const variables = { boardId: String(boardId) };

    const fields = options.fields ? options.fields.join("\n    ") : DEFAULT_COLUMN_FIELDS;

    const query = `
      query GetColumns($boardId: ID!) {
        boards(ids: [$boardId]) {
          columns {
            ${fields}
          }
        }
      }
    `;

    const response = await this.api(query, { variables });
    const boards = response.data?.boards;
    let columns = boards && boards.length > 0 ? boards[0].columns || [] : [];

    // Filter by types if specified
    if (options.types && options.types.length > 0) {
      columns = columns.filter(column => options.types.includes(column.type));
    }

    // Filter archived columns if not requested
    if (!options.includeArchived) {
      columns = columns.filter(column => !column.archived);
    }

    return columns;
  }

  /**
   * Create a new column
   * @param {string|number} boardId - Board ID
   * @param {Object} columnData - Column configuration
   * @param {string} columnData.title - Column title
   * @param {string} columnData.type - Column type
   * @param {Object} [columnData.defaults] - Default column settings
   * @param {string} [columnData.description] - Column description
   * @param {string} [columnData.id] - Custom column ID
   * @param {Object} [options={}] - Additional options
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Created column data
   */
  async createColumn(boardId, columnData, options = {}) {
    if (!boardId) {
      throw new Error("Board ID is required");
    }

    if (!columnData || !columnData.title || !columnData.type) {
      throw new Error("Column title and type are required");
    }

    const variables = {
      boardId: String(boardId),
      columnType: columnData.type,
      columnTitle: columnData.title
    };

    if (columnData.defaults) variables.defaults = JSON.stringify(columnData.defaults);
    if (columnData.description) variables.description = columnData.description;
    if (columnData.id) variables.columnId = columnData.id;

    const fields = options.fields ? options.fields.join("\n  ") : DEFAULT_COLUMN_FIELDS;

    const query = `
      mutation CreateColumn(
        $boardId: ID!
        $columnType: ColumnType!
        $columnTitle: String!
        ${columnData.defaults ? "$defaults: JSON" : ""}
        ${columnData.description ? "$description: String" : ""}
        ${columnData.id ? "$columnId: String" : ""}
      ) {
        create_column(
          board_id: $boardId
          column_type: $columnType
          title: $columnTitle
          ${columnData.defaults ? "defaults: $defaults" : ""}
          ${columnData.description ? "description: $description" : ""}
          ${columnData.id ? "id: $columnId" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.create_column;
  }

  /**
   * Update column properties
   * @param {string} columnId - Column ID
   * @param {Object} updates - Update properties
   * @param {string} [updates.title] - New column title
   * @param {string} [updates.description] - New column description
   * @param {Array<string>} [updates.fields] - Custom fields to return
   * @returns {Promise<Object>} Updated column data
   */
  async updateColumn(columnId, updates) {
    if (!columnId) {
      throw new Error("Column ID is required");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("Updates object cannot be empty");
    }

    const variables = { columnId };
    const mutations = [];

    if (updates.title) {
      variables.title = updates.title;
      mutations.push(`
        change_column_title(column_id: $columnId, title: $title) {
          id
        }
      `);
    }

    if (updates.description) {
      variables.description = updates.description;
      mutations.push(`
        change_column_metadata(column_id: $columnId, column_property: description, value: $description) {
          id
        }
      `);
    }

    if (mutations.length === 0) {
      throw new Error("No valid update properties provided");
    }

    const fields = updates.fields ? updates.fields.join("\n    ") : DEFAULT_COLUMN_FIELDS;

    const query = `
      mutation UpdateColumn(
        $columnId: String!
        ${updates.title ? "$title: String!" : ""}
        ${updates.description ? "$description: String!" : ""}
      ) {
        ${mutations.join("\n        ")}
        
        columns(ids: [$columnId]) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    const columns = response.data?.columns;
    return columns && columns.length > 0 ? columns[0] : null;
  }

  /**
   * Delete/archive a column
   * @param {string} columnId - Column ID
   * @returns {Promise<Object>} Deleted column data
   */
  async deleteColumn(columnId) {
    if (!columnId) {
      throw new Error("Column ID is required");
    }

    const variables = { columnId };

    const query = `
      mutation DeleteColumn($columnId: String!) {
        delete_column(column_id: $columnId) {
          id
          archived
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.delete_column;
  }

  /**
   * Update a single column value for an item
   * @param {string|number} itemId - Item ID
   * @param {string} columnId - Column ID
   * @param {any} value - New column value
   * @param {Object} [options={}] - Additional options
   * @param {boolean} [options.createLabelsIfMissing=false] - Create labels if missing
   * @param {Array<string>} [options.fields] - Custom fields to return for the item
   * @returns {Promise<Object>} Updated item data
   */
  async changeColumnValue(itemId, columnId, value, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    if (!columnId) {
      throw new Error("Column ID is required");
    }

    if (value === undefined || value === null) {
      throw new Error("Column value is required");
    }

    const variables = {
      itemId: String(itemId),
      columnId: columnId,
      value: typeof value === "string" ? value : JSON.stringify(value)
    };

    if (options.createLabelsIfMissing) variables.createLabelsIfMissing = options.createLabelsIfMissing;

    const itemFields = options.fields
      ? options.fields.join("\n  ")
      : `
      id
      name
      column_values {
        id
        type
        title
        text
        value
      }
    `;

    const query = `
      mutation ChangeColumnValue(
        $itemId: ID!
        $columnId: String!
        $value: String!
        ${options.createLabelsIfMissing ? "$createLabelsIfMissing: Boolean" : ""}
      ) {
        change_column_value(
          item_id: $itemId
          column_id: $columnId
          value: $value
          ${options.createLabelsIfMissing ? "create_labels_if_missing: $createLabelsIfMissing" : ""}
        ) {
          ${itemFields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.change_column_value;
  }

  /**
   * Update a simple column value for an item (text, numbers, etc.)
   * @param {string|number} itemId - Item ID
   * @param {string} columnId - Column ID
   * @param {string|number} value - New simple column value
   * @param {Object} [options={}] - Additional options
   * @param {Array<string>} [options.fields] - Custom fields to return for the item
   * @returns {Promise<Object>} Updated item data
   */
  async changeSimpleColumnValue(itemId, columnId, value, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    if (!columnId) {
      throw new Error("Column ID is required");
    }

    if (value === undefined || value === null) {
      throw new Error("Column value is required");
    }

    const variables = {
      itemId: String(itemId),
      columnId: columnId,
      value: String(value)
    };

    const itemFields = options.fields
      ? options.fields.join("\n  ")
      : `
      id
      name
      column_values {
        id
        type
        title
        text
        value
      }
    `;

    const query = `
      mutation ChangeSimpleColumnValue(
        $itemId: ID!
        $columnId: String!
        $value: String!
      ) {
        change_simple_column_value(
          item_id: $itemId
          column_id: $columnId
          value: $value
        ) {
          ${itemFields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.change_simple_column_value;
  }

  /**
   * Get column values for a specific item
   * @param {string|number} itemId - Item ID
   * @param {Object} [options={}] - Query options
   * @param {Array<string>} [options.columnIds] - Specific column IDs to fetch
   * @returns {Promise<Array<Object>>} Array of column values
   */
  async getItemColumnValues(itemId, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    const variables = { itemId: String(itemId) };

    const query = `
      query GetItemColumnValues($itemId: ID!) {
        items(ids: [$itemId]) {
          column_values {
            id
            type
            title
            text
            value
            additional_info
          }
        }
      }
    `;

    const response = await this.api(query, { variables });
    const items = response.data?.items;
    let columnValues = items && items.length > 0 ? items[0].column_values || [] : [];

    // Filter by specific column IDs if requested
    if (options.columnIds && options.columnIds.length > 0) {
      columnValues = columnValues.filter(cv => options.columnIds.includes(cv.id));
    }

    return columnValues;
  }

  /**
   * Clear a column value for an item
   * @param {string|number} itemId - Item ID
   * @param {string} columnId - Column ID
   * @param {Object} [options={}] - Additional options
   * @param {Array<string>} [options.fields] - Custom fields to return for the item
   * @returns {Promise<Object>} Updated item data
   */
  async clearColumnValue(itemId, columnId, options = {}) {
    if (!itemId) {
      throw new Error("Item ID is required");
    }

    if (!columnId) {
      throw new Error("Column ID is required");
    }

    const variables = {
      itemId: String(itemId),
      columnId: columnId
    };

    const itemFields = options.fields
      ? options.fields.join("\n  ")
      : `
      id
      name
      column_values {
        id
        type
        title
        text
        value
      }
    `;

    const query = `
      mutation ClearColumnValue(
        $itemId: ID!
        $columnId: String!
      ) {
        change_column_value(
          item_id: $itemId
          column_id: $columnId
          value: ""
        ) {
          ${itemFields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.change_column_value;
  }

  /**
   * Get all possible column types
   * @returns {Promise<Array<Object>>} Array of column type information
   */
  async getColumnTypes() {
    const query = `
      query GetColumnTypes {
        __type(name: "ColumnType") {
          enumValues {
            name
            description
          }
        }
      }
    `;

    const response = await this.api(query);
    return response.data?.__type?.enumValues || [];
  }

  /**
   * Duplicate a column
   * @param {string} columnId - Source column ID
   * @param {string|number} targetBoardId - Target board ID
   * @param {Object} [options={}] - Duplication options
   * @param {string} [options.title] - Custom title for duplicated column
   * @param {Array<string>} [options.fields] - Custom fields to return
   * @returns {Promise<Object>} Duplicated column data
   */
  async duplicateColumn(columnId, targetBoardId, options = {}) {
    if (!columnId) {
      throw new Error("Column ID is required");
    }

    if (!targetBoardId) {
      throw new Error("Target board ID is required");
    }

    const variables = {
      columnId: columnId,
      boardId: String(targetBoardId)
    };

    if (options.title) variables.title = options.title;

    const fields = options.fields ? options.fields.join("\n  ") : DEFAULT_COLUMN_FIELDS;

    const query = `
      mutation DuplicateColumn(
        $columnId: String!
        $boardId: ID!
        ${options.title ? "$title: String" : ""}
      ) {
        duplicate_column(
          column_id: $columnId
          board_id: $boardId
          ${options.title ? "title: $title" : ""}
        ) {
          ${fields}
        }
      }
    `;

    const response = await this.api(query, { variables });
    return response.data?.duplicate_column;
  }
}

module.exports = ColumnsAPI;
