/**
 * GraphQL queries and mutations for item operations
 */

const CREATE_ITEM = `
  mutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON, $groupId: String, $createLabelsIfMissing: Boolean) {
    create_item(
      board_id: $boardId
      item_name: $itemName
      column_values: $columnValues
      group_id: $groupId
      create_labels_if_missing: $createLabelsIfMissing
    ) {
      id
      name
      board {
        id
        name
      }
      group {
        id
        title
      }
      column_values {
        id
        text
        value
        column {
          id
          title
          type
        }
      }
    }
  }
`;

const GET_ITEM = `
  query GetItem($itemId: ID!) {
    items(ids: [$itemId]) {
      id
      name
      board {
        id
        name
      }
      group {
        id
        title
      }
      column_values {
        id
        text
        value
        column {
          id
          title
          type
        }
      }
    }
  }
`;

const GET_ITEMS = `
  query GetItems($boardId: ID!, $limit: Int, $page: Int, $groupId: String) {
    boards(ids: [$boardId]) {
      id
      name
      items(limit: $limit, page: $page) {
        id
        name
        group {
          id
          title
        }
        column_values {
          id
          text
          value
          column {
            id
            title
            type
          }
        }
      }
    }
  }
`;

const UPDATE_ITEM_COLUMN_VALUES = `
  mutation UpdateItemColumnValues($boardId: ID!, $itemId: ID!, $columnValues: JSON!, $createLabelsIfMissing: Boolean) {
    change_multiple_column_values(
      board_id: $boardId
      item_id: $itemId
      column_values: $columnValues
      create_labels_if_missing: $createLabelsIfMissing
    ) {
      id
      name
      column_values {
        id
        text
        value
        column {
          id
          title
          type
        }
      }
    }
  }
`;

const DELETE_ITEM = `
  mutation DeleteItem($itemId: ID!) {
    delete_item(item_id: $itemId) {
      id
    }
  }
`;

const ITEM_QUERIES = {
  CREATE_ITEM,
  GET_ITEM,
  GET_ITEMS,
  UPDATE_ITEM_COLUMN_VALUES,
  DELETE_ITEM
};

module.exports = { ITEM_QUERIES };
