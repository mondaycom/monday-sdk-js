/**
 * GraphQL queries and mutations for column operations
 */

const GET_COLUMNS = `
  query GetColumns($boardId: ID!) {
    boards(ids: [$boardId]) {
      id
      name
      columns {
        id
        title
        type
        settings_str
        description
      }
    }
  }
`;

const CREATE_COLUMN = `
  mutation CreateColumn($boardId: ID!, $title: String!, $columnType: ColumnType!, $defaults: JSON, $description: String) {
    create_column(
      board_id: $boardId
      title: $title
      column_type: $columnType
      defaults: $defaults
      description: $description
    ) {
      id
      title
      type
      settings_str
      description
    }
  }
`;

const UPDATE_COLUMN = `
  mutation UpdateColumnTitle($boardId: ID!, $columnId: String!, $title: String!) {
    change_column_title(board_id: $boardId, column_id: $columnId, title: $title) {
      id
      title
      type
      settings_str
      description
    }
  }
`;

const UPDATE_COLUMN_METADATA = `
  mutation UpdateColumnMetadata($boardId: ID!, $columnId: String!, $settings: JSON!) {
    change_column_metadata(board_id: $boardId, column_id: $columnId, column_property: settings, value: $settings) {
      id
      title
      type
      settings_str
      description
    }
  }
`;

const DELETE_COLUMN = `
  mutation DeleteColumn($boardId: ID!, $columnId: String!) {
    delete_column(board_id: $boardId, column_id: $columnId) {
      id
    }
  }
`;

const COLUMN_QUERIES = {
  GET_COLUMNS,
  CREATE_COLUMN,
  UPDATE_COLUMN,
  UPDATE_COLUMN_METADATA,
  DELETE_COLUMN
};

module.exports = { COLUMN_QUERIES };
