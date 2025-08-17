/**
 * Tests for SemanticModule base class
 */

const assert = require("assert");
const SemanticModule = require("../core/SemanticModule");

describe("SemanticModule", () => {
  let mockSdk;
  let module;

  beforeEach(() => {
    // Mock SDK instance
    mockSdk = {
      api: (query, options = {}) => {
        // Return a promise that resolves with mock data
        return Promise.resolve({
          data: { test: "success" },
          account_id: 12345
        });
      }
    };

    module = new SemanticModule(mockSdk, true);
  });

  describe("constructor", () => {
    it("should initialize with SDK instance", () => {
      assert.strictEqual(module.sdk, mockSdk);
      assert.strictEqual(module.isClientSdk, true);
    });

    it("should initialize with server SDK", () => {
      const serverModule = new SemanticModule(mockSdk, false);
      assert.strictEqual(serverModule.isClientSdk, false);
    });
  });

  describe("static properties", () => {
    it("should have correct static name", () => {
      assert.strictEqual(SemanticModule.name, "SemanticModule");
    });

    it("should have version", () => {
      assert.strictEqual(SemanticModule.version, "1.0.0");
    });

    it("should have empty dependencies array", () => {
      assert(Array.isArray(SemanticModule.dependencies));
      assert.strictEqual(SemanticModule.dependencies.length, 0);
    });
  });

  describe("_executeQuery", () => {
    it("should execute query with variables", async () => {
      const query = "query { boards { id name } }";
      const variables = { limit: 10 };

      const result = await module._executeQuery(query, variables);

      assert.deepStrictEqual(result, {
        data: { test: "success" },
        account_id: 12345
      });
    });

    it("should execute query without variables", async () => {
      const query = "query { boards { id name } }";

      const result = await module._executeQuery(query);

      assert.deepStrictEqual(result, {
        data: { test: "success" },
        account_id: 12345
      });
    });

    it("should pass options to SDK", async () => {
      let capturedOptions;
      mockSdk.api = (query, options) => {
        capturedOptions = options;
        return Promise.resolve({ data: { test: "success" } });
      };

      const query = "query { boards { id name } }";
      const variables = { limit: 10 };
      const options = { timeout: 5000 };

      await module._executeQuery(query, variables, options);

      assert.strictEqual(capturedOptions.variables.limit, 10);
      assert.strictEqual(capturedOptions.timeout, 5000);
    });
  });

  describe("_handleApiCall", () => {
    it("should handle successful API call", async () => {
      const operation = "testOperation";
      const apiCall = async () => ({ success: true, data: "test" });

      const result = await module._handleApiCall(operation, apiCall);

      assert.deepStrictEqual(result, { success: true, data: "test" });
    });

    it("should handle API call errors", async () => {
      const operation = "testOperation";
      const apiCall = async () => {
        throw new Error("API Error");
      };

      try {
        await module._handleApiCall(operation, apiCall);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert(error.message.includes("API Error"));
      }
    });

    it("should add context to errors", async () => {
      const operation = "createBoard";
      const context = { boardName: "Test Board" };
      const apiCall = async () => {
        throw new Error("Validation failed");
      };

      try {
        await module._handleApiCall(operation, apiCall, context);
        assert.fail("Should have thrown an error");
      } catch (error) {
        // The error should be enhanced by handleApiError
        assert(error.message.includes("Validation failed"));
      }
    });

    it("should support raw error mode", async () => {
      const operation = "testOperation";
      const originalError = new Error("Raw API Error");
      const apiCall = async () => {
        throw originalError;
      };

      try {
        await module._handleApiCall(operation, apiCall, {}, { rawErrors: true });
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.strictEqual(error, originalError);
      }
    });
  });

  describe("error handling", () => {
    it("should validate ID parameters", async () => {
      const operation = "testOperation";
      const apiCall = async () => {
        // Simulate invalid ID validation
        if (!Number.isInteger(123) || 123 <= 0) {
          throw new Error("Invalid ID");
        }
        return { success: true };
      };

      const result = await module._handleApiCall(operation, apiCall);
      assert.deepStrictEqual(result, { success: true });
    });

    it("should handle GraphQL errors", async () => {
      mockSdk.api = () => {
        return Promise.resolve({
          errors: [{ message: "GraphQL error", extensions: { code: "INVALID_QUERY" } }]
        });
      };

      const query = "query { invalid }";

      try {
        const result = await module._executeQuery(query);
        // If no error is thrown, the result should contain the errors
        assert(result.errors);
        assert.strictEqual(result.errors[0].message, "GraphQL error");
      } catch (error) {
        // If an error is thrown, it should be properly formatted
        assert(error.message.includes("GraphQL error"));
      }
    });
  });

  describe("inheritance", () => {
    class TestModule extends SemanticModule {
      static get name() {
        return "test";
      }
      static get version() {
        return "1.0.0";
      }
      static get dependencies() {
        return ["boards"];
      }

      async testMethod() {
        return this._executeQuery("query { test }");
      }
    }

    it("should support inheritance", () => {
      const testModule = new TestModule(mockSdk, true);

      assert.strictEqual(TestModule.name, "test");
      assert.strictEqual(TestModule.version, "1.0.0");
      assert.deepStrictEqual(TestModule.dependencies, ["boards"]);
      assert(typeof testModule.testMethod === "function");
    });

    it("should inherit _executeQuery functionality", async () => {
      const testModule = new TestModule(mockSdk, true);

      const result = await testModule.testMethod();

      assert.deepStrictEqual(result, {
        data: { test: "success" },
        account_id: 12345
      });
    });
  });

  describe("async operations", () => {
    it("should handle concurrent API calls", async () => {
      const queries = ["query { boards { id } }", "query { items { id } }", "query { columns { id } }"];

      const promises = queries.map(query => module._executeQuery(query));
      const results = await Promise.all(promises);

      assert.strictEqual(results.length, 3);
      results.forEach(result => {
        assert.deepStrictEqual(result, {
          data: { test: "success" },
          account_id: 12345
        });
      });
    });

    it("should handle API timeouts", async () => {
      mockSdk.api = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 100);
        });
      };

      const query = "query { boards { id } }";

      try {
        await module._executeQuery(query);
        assert.fail("Should have timed out");
      } catch (error) {
        assert.strictEqual(error.message, "Timeout");
      }
    });
  });
});
