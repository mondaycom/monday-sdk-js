/**
 * Tests for ResponseTransformer
 */

const assert = require("assert");
const {
  parseGraphQLResponse,
  formatBoardData,
  formatItemData,
  formatColumnData,
  formatColumnValueData,
  normalizeColumnValues
} = require("../core/ResponseTransformer");

describe("ResponseTransformer", () => {
  describe("parseGraphQLResponse", () => {
    it("should parse successful GraphQL response", () => {
      const response = {
        data: {
          boards: [{ id: "123", name: "Test Board" }]
        }
      };

      const result = parseGraphQLResponse(response, "boards");
      assert.deepStrictEqual(result, [{ id: "123", name: "Test Board" }]);
    });

    it("should handle GraphQL errors", () => {
      const response = {
        errors: [{ message: "Field error", path: ["boards", 0, "invalid_field"] }]
      };

      try {
        parseGraphQLResponse(response, "boards");
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("Field error"));
      }
    });

    it("should handle missing data key", () => {
      const response = {
        data: {
          boards: [{ id: "123", name: "Test Board" }]
        }
      };

      const result = parseGraphQLResponse(response, "items");
      assert.strictEqual(result, null);
    });

    it("should return raw response when requested", () => {
      const response = {
        data: {
          boards: [{ id: "123", name: "Test Board" }]
        },
        account_id: 12345
      };

      const result = parseGraphQLResponse(response, "boards", { rawResponse: true });
      assert.deepStrictEqual(result, response);
    });

    it("should handle complex nested data", () => {
      const response = {
        data: {
          boards: [
            {
              id: "123",
              name: "Test Board",
              items: [{ id: "456", name: "Test Item" }]
            }
          ]
        }
      };

      const result = parseGraphQLResponse(response, "boards");
      assert.strictEqual(result[0].items[0].name, "Test Item");
    });
  });

  describe("formatBoardData", () => {
    it("should format basic board data", () => {
      const boardData = {
        id: "123456789",
        name: "My Board",
        board_kind: "public",
        state: "active"
      };

      const formatted = formatBoardData(boardData);

      assert.strictEqual(formatted.id, 123456789);
      assert.strictEqual(formatted.name, "My Board");
      assert.strictEqual(formatted.kind, "public");
      assert.strictEqual(formatted.state, "active");
    });

    it("should handle board with creator", () => {
      const boardData = {
        id: "123456789",
        name: "My Board",
        board_kind: "public",
        creator: {
          id: "987654321",
          name: "John Doe",
          email: "john@example.com"
        }
      };

      const formatted = formatBoardData(boardData);

      assert.strictEqual(formatted.creator.id, 987654321);
      assert.strictEqual(formatted.creator.name, "John Doe");
      assert.strictEqual(formatted.creator.email, "john@example.com");
    });

    it("should handle board with columns", () => {
      const boardData = {
        id: "123456789",
        name: "My Board",
        board_kind: "public",
        columns: [
          { id: "status", title: "Status", type: "color" },
          { id: "text", title: "Text", type: "text" }
        ]
      };

      const formatted = formatBoardData(boardData);

      assert.strictEqual(formatted.columns.length, 2);
      assert.strictEqual(formatted.columns[0].id, "status");
      assert.strictEqual(formatted.columns[0].title, "Status");
    });

    it("should handle board with workspace", () => {
      const boardData = {
        id: "123456789",
        name: "My Board",
        board_kind: "public",
        workspace: {
          id: "555",
          name: "My Workspace"
        }
      };

      const formatted = formatBoardData(boardData);

      assert.strictEqual(formatted.workspace.id, 555);
      assert.strictEqual(formatted.workspace.name, "My Workspace");
    });

    it("should handle null/undefined values gracefully", () => {
      const boardData = {
        id: "123456789",
        name: "My Board",
        board_kind: null,
        creator: null,
        workspace: undefined
      };

      const formatted = formatBoardData(boardData);

      assert.strictEqual(formatted.id, 123456789);
      assert.strictEqual(formatted.name, "My Board");
      assert.strictEqual(formatted.kind, "public"); // Default fallback
      assert.strictEqual(formatted.creator, null);
      assert.strictEqual(formatted.workspace, undefined);
    });
  });

  describe("formatItemData", () => {
    it("should format basic item data", () => {
      const itemData = {
        id: "987654321",
        name: "My Item",
        state: "active"
      };

      const formatted = formatItemData(itemData);

      assert.strictEqual(formatted.id, 987654321);
      assert.strictEqual(formatted.name, "My Item");
      assert.strictEqual(formatted.state, "active");
    });

    it("should handle item with board", () => {
      const itemData = {
        id: "987654321",
        name: "My Item",
        board: {
          id: "123456789",
          name: "My Board"
        }
      };

      const formatted = formatItemData(itemData);

      assert.strictEqual(formatted.board.id, 123456789);
      assert.strictEqual(formatted.board.name, "My Board");
    });

    it("should handle item with group", () => {
      const itemData = {
        id: "987654321",
        name: "My Item",
        group: {
          id: "topics",
          title: "Topics"
        }
      };

      const formatted = formatItemData(itemData);

      assert.strictEqual(formatted.group.id, "topics");
      assert.strictEqual(formatted.group.title, "Topics");
    });

    it("should format column values", () => {
      const itemData = {
        id: "987654321",
        name: "My Item",
        column_values: [
          { id: "status", text: "Working on it", value: '{"index":1}' },
          { id: "text", text: "Sample text", value: '"Sample text"' }
        ]
      };

      const formatted = formatItemData(itemData);

      assert.strictEqual(formatted.column_values.length, 2);
      assert.strictEqual(formatted.column_values[0].id, "status");
      assert.strictEqual(formatted.column_values[0].text, "Working on it");
    });

    it("should handle subscribers", () => {
      const itemData = {
        id: "987654321",
        name: "My Item",
        subscribers: [
          { id: "111", name: "John Doe", email: "john@example.com" },
          { id: "222", name: "Jane Smith", email: "jane@example.com" }
        ]
      };

      const formatted = formatItemData(itemData);

      assert.strictEqual(formatted.subscribers.length, 2);
      assert.strictEqual(formatted.subscribers[0].id, 111);
      assert.strictEqual(formatted.subscribers[0].name, "John Doe");
    });
  });

  describe("formatColumnData", () => {
    it("should format basic column data", () => {
      const columnData = {
        id: "status",
        title: "Status",
        type: "color",
        width: 150
      };

      const formatted = formatColumnData(columnData);

      assert.strictEqual(formatted.id, "status");
      assert.strictEqual(formatted.title, "Status");
      assert.strictEqual(formatted.type, "color");
      assert.strictEqual(formatted.width, 150);
    });

    it("should handle archived columns", () => {
      const columnData = {
        id: "old_column",
        title: "Old Column",
        type: "text",
        archived: true
      };

      const formatted = formatColumnData(columnData);

      assert.strictEqual(formatted.archived, true);
    });

    it("should handle column settings", () => {
      const columnData = {
        id: "status",
        title: "Status",
        type: "color",
        settings_str: '{"labels":[{"id":1,"name":"Working on it","color":"#fdab3d"}]}'
      };

      const formatted = formatColumnData(columnData);

      assert.strictEqual(formatted.settings_str, columnData.settings_str);
    });
  });

  describe("formatColumnValueData", () => {
    it("should format column value with JSON value", () => {
      const columnValueData = {
        id: "status",
        text: "Working on it",
        value: '{"index":1,"post_id":null,"changed_at":"2023-01-01T00:00:00.000Z"}',
        column: {
          id: "status",
          title: "Status",
          type: "color"
        }
      };

      const formatted = formatColumnValueData(columnValueData);

      assert.strictEqual(formatted.id, "status");
      assert.strictEqual(formatted.text, "Working on it");
      assert.strictEqual(formatted.value.index, 1);
      assert.strictEqual(formatted.column.title, "Status");
    });

    it("should handle string value", () => {
      const columnValueData = {
        id: "text",
        text: "Sample text",
        value: '"Sample text"'
      };

      const formatted = formatColumnValueData(columnValueData);

      assert.strictEqual(formatted.value, "Sample text");
    });

    it("should handle invalid JSON gracefully", () => {
      const columnValueData = {
        id: "text",
        text: "Sample text",
        value: "invalid json"
      };

      const formatted = formatColumnValueData(columnValueData);

      assert.strictEqual(formatted.value, "invalid json");
    });

    it("should handle null/empty values", () => {
      const columnValueData = {
        id: "empty",
        text: "",
        value: null
      };

      const formatted = formatColumnValueData(columnValueData);

      assert.strictEqual(formatted.value, null);
    });
  });

  describe("normalizeColumnValues", () => {
    it("should normalize array of column values", () => {
      const columnValues = [
        { id: "status", text: "Working on it", value: '{"index":1}' },
        { id: "text", text: "Sample text", value: '"Sample text"' },
        { id: "date", text: "2023-01-01", value: '{"date":"2023-01-01"}' }
      ];

      const normalized = normalizeColumnValues(columnValues);

      assert.strictEqual(normalized.length, 3);
      assert.strictEqual(normalized[0].id, "status");
      assert.strictEqual(normalized[1].value, "Sample text");
      assert.strictEqual(normalized[2].value.date, "2023-01-01");
    });

    it("should handle empty array", () => {
      const normalized = normalizeColumnValues([]);
      assert.deepStrictEqual(normalized, []);
    });

    it("should handle null/undefined input", () => {
      assert.deepStrictEqual(normalizeColumnValues(null), []);
      assert.deepStrictEqual(normalizeColumnValues(undefined), []);
    });
  });

  describe("error handling", () => {
    it("should handle malformed data gracefully", () => {
      const malformedBoard = {
        id: "not_a_number",
        name: null,
        board_kind: "invalid_kind"
      };

      const formatted = formatBoardData(malformedBoard);

      // Should still format what it can
      assert.strictEqual(formatted.name, null);
      assert.strictEqual(formatted.kind, "invalid_kind");
    });

    it("should handle deeply nested null values", () => {
      const itemData = {
        id: "123",
        name: "Test",
        board: null,
        group: {
          id: null,
          title: undefined
        },
        column_values: null
      };

      const formatted = formatItemData(itemData);

      assert.strictEqual(formatted.board, null);
      assert.strictEqual(formatted.group.id, null);
      assert.strictEqual(formatted.group.title, undefined);
      assert.deepStrictEqual(formatted.column_values, []);
    });
  });
});
