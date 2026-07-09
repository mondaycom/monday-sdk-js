/**
 * GraphQL queries and mutations for board operations
 */

const CREATE_BOARD = `
  mutation CreateBoard($boardName: String!, $boardKind: BoardKind!, $templateId: ID, $description: String) {
    create_board(
      board_name: $boardName
      board_kind: $boardKind
      template_id: $templateId
      description: $description
    ) {
      id
      name
      description
      board_kind
      state
      board_folder_id
      columns {
        id
        title
        type
        settings_str
        description
      }
      groups {
        id
        title
        color
      }
    }
  }
`;

const GET_BOARD = `
  query GetBoard($boardId: ID!) {
    boards(ids: [$boardId]) {
      id
      name
      description
      board_kind
      state
      board_folder_id
      columns {
        id
        title
        type
        settings_str
        description
      }
      groups {
        id
        title
        color
        items {
          id
          name
          column_values {
            id
            text
            value
          }
        }
      }
    }
  }
`;

const GET_BOARDS = `
  query GetBoards($limit: Int, $page: Int, $orderBy: [BoardsOrderBy!], $state: State) {
    boards(limit: $limit, page: $page, order_by: $orderBy, state: $state) {
      id
      name
      description
      board_kind
      state
      board_folder_id
      columns {
        id
        title
        type
        settings_str
        description
      }
      groups {
        id
        title
        color
      }
    }
  }
`;

const UPDATE_BOARD = `
  mutation UpdateBoard($boardId: ID!, $boardName: String) {
    change_board_name(board_id: $boardId, board_name: $boardName) {
      id
      name
      description
      board_kind
      state
    }
  }
`;

const DELETE_BOARD = `
  mutation DeleteBoard($boardId: ID!) {
    delete_board(board_id: $boardId) {
      id
    }
  }
`;

const BOARD_QUERIES = {
  CREATE_BOARD,
  GET_BOARD,
  GET_BOARDS,
  UPDATE_BOARD,
  DELETE_BOARD
};

module.exports = { BOARD_QUERIES };
