/**
 * Utilities for parsing GraphQL responses and transforming them to semantic objects
 */

/**
 * Parse a GraphQL response and extract the requested data
 * @param {Object} response - GraphQL response object
 * @param {string} dataKey - Key to extract from response.data
 * @param {Object} options - Options for response processing
 * @param {boolean} options.raw - Return raw response without transformation
 * @returns {*} Extracted and transformed data or null
 */
function parseGraphQLResponse(response, dataKey, options = {}) {
  if (!response || typeof response !== "object") {
    return null;
  }

  // Handle GraphQL errors
  if (response.errors && response.errors.length > 0) {
    const errorMessage = response.errors.map(err => err.message).join(", ");
    throw new Error(`GraphQL Error: ${errorMessage}`);
  }

  // Return raw response if requested
  if (options.rawResponse) {
    return response;
  }

  // Extract data
  if (response.data && typeof response.data === "object") {
    return response.data[dataKey] || null;
  }

  return null;
}

/**
 * Format board data from GraphQL response to semantic object
 * @param {Object} boardData - Raw board data from GraphQL
 * @returns {Object|null} Formatted board object
 */
function formatBoardData(boardData) {
  if (!boardData) return null;

  return {
    id: parseInt(boardData.id),
    name: boardData.name,
    description: boardData.description,
    kind: boardData.board_kind || "public", // Default fallback
    state: boardData.state,
    permalink: boardData.permalink,
    created_at: boardData.created_at,
    updated_at: boardData.updated_at,
    creator: boardData.creator
      ? {
          id: parseInt(boardData.creator.id),
          name: boardData.creator.name,
          email: boardData.creator.email
        }
      : null,
    owners: boardData.owners
      ? boardData.owners.map(owner => ({
          id: parseInt(owner.id),
          name: owner.name,
          email: owner.email
        }))
      : undefined,
    permissions: boardData.permissions,
    workspace: boardData.workspace
      ? {
          id: parseInt(boardData.workspace.id),
          name: boardData.workspace.name
        }
      : undefined,
    columns: boardData.columns ? boardData.columns.map(formatColumnData) : [],
    items: boardData.items ? boardData.items.map(formatItemData) : undefined
  };
}

/**
 * Format item data from GraphQL response to semantic object
 * @param {Object} itemData - Raw item data from GraphQL
 * @returns {Object|null} Formatted item object
 */
function formatItemData(itemData) {
  if (!itemData) return null;

  return {
    id: parseInt(itemData.id),
    name: itemData.name,
    created_at: itemData.created_at,
    updated_at: itemData.updated_at,
    state: itemData.state,
    creator: itemData.creator
      ? {
          id: parseInt(itemData.creator.id),
          name: itemData.creator.name,
          email: itemData.creator.email
        }
      : undefined,
    board: itemData.board
      ? {
          id: parseInt(itemData.board.id),
          name: itemData.board.name
        }
      : null,
    group: itemData.group
      ? {
          id: itemData.group.id,
          title: itemData.group.title
        }
      : null,
    column_values: itemData.column_values ? normalizeColumnValues(itemData.column_values) : [],
    subscribers: itemData.subscribers
      ? itemData.subscribers.map(sub => ({
          id: parseInt(sub.id),
          name: sub.name,
          email: sub.email
        }))
      : undefined
  };
}

/**
 * Format column data from GraphQL response to semantic object
 * @param {Object} columnData - Raw column data from GraphQL
 * @returns {Object|null} Formatted column object
 */
function formatColumnData(columnData) {
  if (!columnData) return null;

  return {
    id: columnData.id,
    title: columnData.title,
    type: columnData.type,
    description: columnData.description,
    settings_str: columnData.settings_str,
    width: columnData.width,
    archived: columnData.archived
  };
}

/**
 * Format column value data from GraphQL response to semantic object
 * @param {Object} columnValueData - Raw column value data from GraphQL
 * @returns {Object|null} Formatted column value object
 */
function formatColumnValueData(columnValueData) {
  if (!columnValueData) return null;

  let parsedValue = null;
  if (columnValueData.value) {
    try {
      parsedValue = JSON.parse(columnValueData.value);
    } catch (e) {
      // If JSON parsing fails, keep the original value
      parsedValue = columnValueData.value;
    }
  }

  return {
    id: columnValueData.id,
    text: columnValueData.text,
    value: parsedValue,
    additional_info: columnValueData.additional_info,
    column: columnValueData.column ? formatColumnData(columnValueData.column) : undefined
  };
}

/**
 * Format group data from GraphQL response to semantic object
 * @param {Object} groupData - Raw group data from GraphQL
 * @returns {Object|null} Formatted group object
 */
function formatGroupData(groupData) {
  if (!groupData) return null;

  return {
    id: groupData.id,
    title: groupData.title,
    color: groupData.color,
    items: groupData.items ? groupData.items.map(formatItemData) : []
  };
}

/**
 * Normalize array of column values from GraphQL response
 * @param {Array} columnValues - Array of column value objects to normalize
 * @returns {Array} Normalized column values
 */
function normalizeColumnValues(columnValues) {
  if (!columnValues) {
    return [];
  }

  if (!Array.isArray(columnValues)) {
    return [];
  }

  return columnValues.map(columnValue => formatColumnValueData(columnValue));
}

module.exports = {
  parseGraphQLResponse,
  formatBoardData,
  formatItemData,
  formatColumnData,
  formatColumnValueData,
  formatGroupData,
  normalizeColumnValues
};
