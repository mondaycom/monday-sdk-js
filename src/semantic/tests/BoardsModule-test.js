/**
 * Tests for BoardsModule
 */

const assert = require("assert");
const BoardsModule = require("../modules/BoardsModule");
const { BoardError } = require("../core/SemanticError");

describe("BoardsModule", () => {
  let mockSdk;
  let boardsModule;

  beforeEach(() => {
    // Mock SDK instance with api method
    mockSdk = {
      api: (query, options = {}) => {
        // Default successful response
        return Promise.resolve({
          data: {
            create_board: {
              id: "123456789",
              name: "Test Board",
              board_kind: "public",
              state: "active"
            }
          },
          account_id: 12345
        });
      }
    };

    boardsModule = new BoardsModule(mockSdk, true);
  });

  describe("constructor", () => {
    it("should initialize with SDK instance", () => {
      assert.strictEqual(boardsModule.sdk, mockSdk);
      assert.strictEqual(boardsModule.isClientSdk, true);
    });

    it("should have correct static properties", () => {
      assert.strictEqual(BoardsModule.name, "boards");
      assert.strictEqual(BoardsModule.version, "1.0.0");
      assert.deepStrictEqual(BoardsModule.dependencies, []);
    });
  });

  describe("createBoard", () => {
    it("should create a public board with minimal parameters", async () => {
      mockSdk.api = (query, options) => {
        assert(query.includes("create_board"));
        assert.strictEqual(options.variables.board_name, "Test Board");
        assert.strictEqual(options.variables.board_kind, "public");

        return Promise.resolve({
          data: {
            create_board: {
              id: "123456789",
              name: "Test Board",
              board_kind: "public",
              state: "active"
            }
          }
        });
      };

      const result = await boardsModule.createBoard("Test Board");

      assert.strictEqual(result.board.id, 123456789);
      assert.strictEqual(result.board.name, "Test Board");
      assert.strictEqual(result.board.kind, "public");
    });

    it("should create a private board", async () => {
      mockSdk.api = (query, options) => {
        assert.strictEqual(options.variables.board_kind, "private");
        return Promise.resolve({
          data: {
            create_board: {
              id: "123456789",
              name: "Private Board",
              board_kind: "private",
              state: "active"
            }
          }
        });
      };

      const result = await boardsModule.createBoard("Private Board", "private");
      assert.strictEqual(result.board.kind, "private");
    });

    it("should handle board creation with template", async () => {
      mockSdk.api = (query, options) => {
        assert.strictEqual(options.variables.template_id, 12345);
        return Promise.resolve({
          data: {
            create_board: {
              id: "123456789",
              name: "From Template",
              board_kind: "public",
              state: "active"
            }
          }
        });
      };

      const result = await boardsModule.createBoard("From Template", "public", {
        template_id: 12345
      });

      assert.strictEqual(result.board.name, "From Template");
    });

    it("should validate board name", async () => {
      try {
        await boardsModule.createBoard("");
        assert.fail("Should have thrown validation error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Board name is required"));
      }
    });

    it("should handle API errors", async () => {
      mockSdk.api = () => {
        return Promise.reject(new Error("Board creation failed"));
      };

      try {
        await boardsModule.createBoard("Test Board");
        assert.fail("Should have thrown error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Board creation failed"));
      }
    });
  });

  describe("getBoard", () => {
    it("should get board by ID", async () => {
      mockSdk.api = (query, options) => {
        assert(query.includes("boards"));
        assert.strictEqual(options.variables.board_id, 123456789);

        return Promise.resolve({
          data: {
            boards: [
              {
                id: "123456789",
                name: "Retrieved Board",
                board_kind: "public",
                state: "active"
              }
            ]
          }
        });
      };

      const result = await boardsModule.getBoard(123456789);

      assert.strictEqual(result.board.id, 123456789);
      assert.strictEqual(result.board.name, "Retrieved Board");
    });

    it("should include columns when requested", async () => {
      mockSdk.api = (query, options) => {
        assert(query.includes("columns"));

        return Promise.resolve({
          data: {
            boards: [
              {
                id: "123456789",
                name: "Board with Columns",
                board_kind: "public",
                columns: [{ id: "status", title: "Status", type: "color" }]
              }
            ]
          }
        });
      };

      const result = await boardsModule.getBoard(123456789, {
        includeColumns: true
      });

      assert(result.board.columns);
      assert.strictEqual(result.board.columns.length, 1);
    });

    it("should validate board ID", async () => {
      try {
        await boardsModule.getBoard("invalid");
        assert.fail("Should have thrown validation error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Board ID must be a positive integer"));
      }
    });

    it("should handle board not found", async () => {
      mockSdk.api = () => {
        return Promise.resolve({
          data: { boards: [] }
        });
      };

      try {
        await boardsModule.getBoard(999999999);
        assert.fail("Should have thrown not found error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Board not found"));
      }
    });
  });

  describe("getBoards", () => {
    it("should get all boards", async () => {
      mockSdk.api = (query, options) => {
        assert(query.includes("boards"));

        return Promise.resolve({
          data: {
            boards: [
              { id: "123", name: "Board 1", board_kind: "public" },
              { id: "456", name: "Board 2", board_kind: "private" }
            ]
          }
        });
      };

      const result = await boardsModule.getBoards();

      assert.strictEqual(result.boards.length, 2);
      assert.strictEqual(result.boards[0].name, "Board 1");
      assert.strictEqual(result.boards[1].name, "Board 2");
    });

    it("should apply limit and pagination", async () => {
      mockSdk.api = (query, options) => {
        assert.strictEqual(options.variables.limit, 10);
        assert.strictEqual(options.variables.page, 2);

        return Promise.resolve({
          data: {
            boards: [{ id: "789", name: "Page 2 Board", board_kind: "public" }]
          }
        });
      };

      const result = await boardsModule.getBoards({
        limit: 10,
        page: 2
      });

      assert.strictEqual(result.boards.length, 1);
    });

    it("should filter by workspace", async () => {
      mockSdk.api = (query, options) => {
        assert.deepStrictEqual(options.variables.workspace_ids, [12345, 67890]);

        return Promise.resolve({
          data: {
            boards: [{ id: "111", name: "Workspace Board", board_kind: "public" }]
          }
        });
      };

      const result = await boardsModule.getBoards({
        workspace_ids: [12345, 67890]
      });

      assert.strictEqual(result.boards[0].name, "Workspace Board");
    });

    it("should handle empty results", async () => {
      mockSdk.api = () => {
        return Promise.resolve({
          data: { boards: [] }
        });
      };

      const result = await boardsModule.getBoards();

      assert.deepStrictEqual(result.boards, []);
    });
  });

  describe("updateBoard", () => {
    it("should update board name", async () => {
      mockSdk.api = (query, options) => {
        assert(query.includes("update_board"));
        assert.strictEqual(options.variables.board_id, 123456789);
        assert.strictEqual(options.variables.board_attribute.name, "Updated Name");

        return Promise.resolve({
          data: {
            update_board: {
              id: "123456789",
              name: "Updated Name",
              board_kind: "public"
            }
          }
        });
      };

      const result = await boardsModule.updateBoard(123456789, {
        name: "Updated Name"
      });

      assert.strictEqual(result.board.name, "Updated Name");
    });

    it("should update board description", async () => {
      mockSdk.api = (query, options) => {
        assert.strictEqual(options.variables.board_attribute.description, "New description");

        return Promise.resolve({
          data: {
            update_board: {
              id: "123456789",
              name: "Test Board",
              description: "New description",
              board_kind: "public"
            }
          }
        });
      };

      const result = await boardsModule.updateBoard(123456789, {
        description: "New description"
      });

      assert.strictEqual(result.board.description, "New description");
    });

    it("should validate board ID for update", async () => {
      try {
        await boardsModule.updateBoard(-1, { name: "New Name" });
        assert.fail("Should have thrown validation error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Board ID must be a positive integer"));
      }
    });

    it("should validate update data", async () => {
      try {
        await boardsModule.updateBoard(123456789, {});
        assert.fail("Should have thrown validation error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("At least one field must be provided"));
      }
    });

    it("should handle update errors", async () => {
      mockSdk.api = () => {
        return Promise.reject(new Error("Update failed"));
      };

      try {
        await boardsModule.updateBoard(123456789, { name: "New Name" });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Update failed"));
      }
    });
  });

  describe("deleteBoard", () => {
    it("should delete board", async () => {
      mockSdk.api = (query, options) => {
        assert(query.includes("delete_board"));
        assert.strictEqual(options.variables.board_id, 123456789);

        return Promise.resolve({
          data: {
            delete_board: {
              id: "123456789"
            }
          }
        });
      };

      const result = await boardsModule.deleteBoard(123456789);

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.board_id, 123456789);
    });

    it("should validate board ID for deletion", async () => {
      try {
        await boardsModule.deleteBoard(0);
        assert.fail("Should have thrown validation error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Board ID must be a positive integer"));
      }
    });

    it("should handle deletion errors", async () => {
      mockSdk.api = () => {
        return Promise.reject(new Error("Deletion failed"));
      };

      try {
        await boardsModule.deleteBoard(123456789);
        assert.fail("Should have thrown error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Deletion failed"));
      }
    });

    it("should handle API returning null result", async () => {
      mockSdk.api = () => {
        return Promise.resolve({
          data: { delete_board: null }
        });
      };

      try {
        await boardsModule.deleteBoard(123456789);
        assert.fail("Should have thrown error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Board deletion failed"));
      }
    });
  });

  describe("error handling", () => {
    it("should handle GraphQL errors with raw error mode", async () => {
      const graphqlError = new Error("GraphQL Error");
      mockSdk.api = () => Promise.reject(graphqlError);

      try {
        await boardsModule.createBoard("Test", "public", { rawErrors: true });
        assert.fail("Should have thrown error");
      } catch (error) {
        assert.strictEqual(error, graphqlError);
      }
    });

    it("should handle network timeouts", async () => {
      mockSdk.api = () => {
        const timeoutError = new Error("Network timeout");
        timeoutError.code = "NETWORK_TIMEOUT";
        return Promise.reject(timeoutError);
      };

      try {
        await boardsModule.getBoard(123456789);
        assert.fail("Should have thrown error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Network timeout"));
      }
    });

    it("should provide context in errors", async () => {
      mockSdk.api = () => Promise.reject(new Error("API Error"));

      try {
        await boardsModule.createBoard("Test Board", "public");
        assert.fail("Should have thrown error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert.strictEqual(error.operation, "createBoard");
        assert.strictEqual(error.context.boardName, "Test Board");
      }
    });
  });

  describe("response transformation", () => {
    it("should return raw response when requested", async () => {
      const rawResponse = {
        data: {
          boards: [{ id: "123", name: "Raw Board" }]
        },
        account_id: 12345
      };

      mockSdk.api = () => Promise.resolve(rawResponse);

      const result = await boardsModule.getBoard(123, { rawResponse: true });

      assert.deepStrictEqual(result, rawResponse);
    });

    it("should transform response by default", async () => {
      mockSdk.api = () => {
        return Promise.resolve({
          data: {
            boards: [
              {
                id: "123456789",
                name: "Transformed Board",
                board_kind: "public",
                creator: {
                  id: "999",
                  name: "Creator Name"
                }
              }
            ]
          }
        });
      };

      const result = await boardsModule.getBoard(123456789);

      assert.strictEqual(result.board.id, 123456789); // Converted to number
      assert.strictEqual(result.board.creator.id, 999); // Converted to number
    });
  });

  describe("concurrent operations", () => {
    it("should handle multiple concurrent board operations", async () => {
      mockSdk.api = (query, options) => {
        const boardId = options.variables.board_id || "123";
        return Promise.resolve({
          data: {
            boards: [
              {
                id: boardId,
                name: `Board ${boardId}`,
                board_kind: "public"
              }
            ]
          }
        });
      };

      const promises = [boardsModule.getBoard(123), boardsModule.getBoard(456), boardsModule.getBoard(789)];

      const results = await Promise.all(promises);

      assert.strictEqual(results.length, 3);
      assert.strictEqual(results[0].board.id, 123);
      assert.strictEqual(results[1].board.id, 456);
      assert.strictEqual(results[2].board.id, 789);
    });
  });
});
