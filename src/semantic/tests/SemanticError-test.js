/**
 * Tests for SemanticError and error handling
 */

const assert = require("assert");
const { SemanticError, BoardError, ItemError, ColumnError, handleApiError } = require("../core/SemanticError");

describe("SemanticError", () => {
  describe("SemanticError class", () => {
    it("should create basic semantic error", () => {
      const error = new SemanticError("Test error", null, "testOperation", {});

      assert.strictEqual(error.name, "SemanticError");
      assert.strictEqual(error.message, "Test error");
      assert.strictEqual(error.operation, "testOperation");
      assert.strictEqual(error.originalError, null);
      assert.deepStrictEqual(error.context, {});
      assert(error instanceof Error);
    });

    it("should create error with original error", () => {
      const originalError = new Error("Original error");
      const error = new SemanticError("Semantic error", originalError, "testOperation", { id: 123 });

      assert.strictEqual(error.originalError, originalError);
      assert.strictEqual(error.context.id, 123);
    });

    it("should maintain error stack trace", () => {
      const error = new SemanticError("Test error", null, "testOperation", {});
      assert(error.stack);
      assert(error.stack.includes("SemanticError"));
    });
  });

  describe("BoardError class", () => {
    it("should create board-specific error", () => {
      const error = new BoardError("Board not found", null, "getBoard", { boardId: 123 });

      assert.strictEqual(error.name, "BoardError");
      assert.strictEqual(error.message, "Board not found");
      assert.strictEqual(error.operation, "getBoard");
      assert.strictEqual(error.context.boardId, 123);
      assert(error instanceof SemanticError);
      assert(error instanceof Error);
    });

    it("should format board error message", () => {
      const error = new BoardError("Invalid board ID", null, "createBoard", { boardId: "invalid" });

      assert(error.message.includes("Invalid board ID"));
    });
  });

  describe("ItemError class", () => {
    it("should create item-specific error", () => {
      const error = new ItemError("Item not found", null, "getItem", { itemId: 456 });

      assert.strictEqual(error.name, "ItemError");
      assert.strictEqual(error.operation, "getItem");
      assert.strictEqual(error.context.itemId, 456);
      assert(error instanceof SemanticError);
    });
  });

  describe("ColumnError class", () => {
    it("should create column-specific error", () => {
      const error = new ColumnError("Invalid column type", null, "createColumn", { columnType: "invalid" });

      assert.strictEqual(error.name, "ColumnError");
      assert.strictEqual(error.operation, "createColumn");
      assert.strictEqual(error.context.columnType, "invalid");
      assert(error instanceof SemanticError);
    });
  });

  describe("handleApiError function", () => {
    it("should handle GraphQL errors", () => {
      const graphqlError = {
        message: 'Field "invalid_field" doesn\'t exist on type "Board"',
        extensions: {
          code: "INVALID_FIELD"
        },
        path: ["boards", 0, "invalid_field"]
      };

      const operation = "getBoard";
      const context = { boardId: 123 };

      try {
        handleApiError(graphqlError, operation, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error instanceof SemanticError);
        assert(error.message.includes("INVALID_FIELD"));
        assert.strictEqual(error.operation, operation);
        assert.strictEqual(error.context.boardId, 123);
      }
    });

    it("should handle network errors", () => {
      const networkError = new Error("Network timeout");
      networkError.code = "NETWORK_ERROR";

      const operation = "createBoard";
      const context = { boardName: "Test Board" };

      try {
        handleApiError(networkError, operation, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error instanceof SemanticError);
        assert(error.message.includes("Network timeout"));
        assert.strictEqual(error.originalError, networkError);
      }
    });

    it("should create board-specific errors for board operations", () => {
      const error = new Error("Board creation failed");
      const operation = "createBoard";
      const context = { boardName: "Test Board" };

      try {
        handleApiError(error, operation, context);
        assert.fail("Should have thrown an error");
      } catch (semanticError) {
        assert(semanticError instanceof BoardError);
        assert.strictEqual(semanticError.context.boardName, "Test Board");
      }
    });

    it("should create item-specific errors for item operations", () => {
      const error = new Error("Item update failed");
      const operation = "updateItem";
      const context = { itemId: 456 };

      try {
        handleApiError(error, operation, context);
        assert.fail("Should have thrown an error");
      } catch (semanticError) {
        assert(semanticError instanceof ItemError);
        assert.strictEqual(semanticError.context.itemId, 456);
      }
    });

    it("should create column-specific errors for column operations", () => {
      const error = new Error("Column deletion failed");
      const operation = "deleteColumn";
      const context = { columnId: "status" };

      try {
        handleApiError(error, operation, context);
        assert.fail("Should have thrown an error");
      } catch (semanticError) {
        assert(semanticError instanceof ColumnError);
        assert.strictEqual(semanticError.context.columnId, "status");
      }
    });

    it("should return raw error when rawErrors option is true", () => {
      const originalError = new Error("Raw error");
      const operation = "testOperation";
      const context = {};
      const options = { rawErrors: true };

      try {
        handleApiError(originalError, operation, context, options);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.strictEqual(error, originalError);
        assert(!(error instanceof SemanticError));
      }
    });

    it("should handle validation errors", () => {
      const validationError = new Error("Validation failed: Board name is required");
      validationError.code = "VALIDATION_ERROR";

      const operation = "createBoard";
      const context = { boardName: "" };

      try {
        handleApiError(validationError, operation, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Validation failed"));
      }
    });

    it("should handle permission errors", () => {
      const permissionError = new Error("Insufficient permissions");
      permissionError.code = "PERMISSION_DENIED";

      const operation = "deleteBoard";
      const context = { boardId: 123 };

      try {
        handleApiError(permissionError, operation, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Insufficient permissions"));
      }
    });

    it("should handle quota/rate limit errors", () => {
      const quotaError = new Error("Rate limit exceeded");
      quotaError.code = "RATE_LIMIT_EXCEEDED";

      const operation = "getBoards";
      const context = {};

      try {
        handleApiError(quotaError, operation, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error instanceof BoardError);
        assert(error.message.includes("Rate limit exceeded"));
      }
    });

    it("should handle unknown errors gracefully", () => {
      const unknownError = { weird: "object", not: "error" };

      const operation = "unknownOperation";
      const context = {};

      try {
        handleApiError(unknownError, operation, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error instanceof SemanticError);
        assert(error.message.includes("Unknown error"));
      }
    });

    it("should preserve error context across transformations", () => {
      const originalError = new Error("Original error");
      originalError.details = { code: "CUSTOM_CODE", timestamp: "2023-01-01" };

      const operation = "customOperation";
      const context = { userId: 789, action: "test" };

      try {
        handleApiError(originalError, operation, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error instanceof SemanticError);
        assert.strictEqual(error.context.userId, 789);
        assert.strictEqual(error.context.action, "test");
        assert.strictEqual(error.originalError, originalError);
      }
    });
  });

  describe("error message formatting", () => {
    it("should format GraphQL field errors nicely", () => {
      const fieldError = {
        message: 'Field "invalid_field" doesn\'t exist on type "Board"',
        path: ["boards", 0, "invalid_field"],
        extensions: { code: "INVALID_FIELD" }
      };

      try {
        handleApiError(fieldError, "getBoard", { boardId: 123 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("invalid_field"));
        assert(error.message.includes("Board"));
      }
    });

    it("should format authentication errors", () => {
      const authError = new Error("Invalid or expired token");
      authError.code = "AUTHENTICATION_ERROR";

      try {
        handleApiError(authError, "getBoard", { boardId: 123 });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("Invalid or expired token"));
      }
    });

    it("should include operation context in error messages", () => {
      const error = new Error("Operation failed");

      try {
        handleApiError(error, "createBoard", { boardName: "My Board" });
        assert.fail("Should have thrown an error");
      } catch (semanticError) {
        assert(semanticError.message.includes("createBoard") || semanticError.context.boardName === "My Board");
      }
    });
  });
});
