const { sinon, expect } = require("../tests/helpers");
const { createSemanticAPI, BoardsAPI, ItemsAPI, ColumnsAPI } = require("./index");

describe("Semantic API Index", () => {
  let mockSDKInstance;

  beforeEach(() => {
    mockSDKInstance = {
      api: sinon.stub().resolves({ data: {} })
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createSemanticAPI", () => {
    it("should create semantic API instance with all API modules", () => {
      const semanticAPI = createSemanticAPI(mockSDKInstance);

      expect(semanticAPI).to.have.property("boards");
      expect(semanticAPI).to.have.property("items");
      expect(semanticAPI).to.have.property("columns");

      expect(semanticAPI.boards).to.be.instanceOf(BoardsAPI);
      expect(semanticAPI.items).to.be.instanceOf(ItemsAPI);
      expect(semanticAPI.columns).to.be.instanceOf(ColumnsAPI);
    });

    it("should bind API methods to SDK instance", async () => {
      const semanticAPI = createSemanticAPI(mockSDKInstance);

      // Test that the API client is properly bound
      await semanticAPI.boards.getBoards();

      expect(mockSDKInstance.api).to.have.been.calledOnce;
    });

    it("should throw error for invalid SDK instance", () => {
      try {
        createSemanticAPI(null);
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("SDK instance must have an api() method");
      }
    });

    it("should throw error for SDK instance without api method", () => {
      try {
        createSemanticAPI({});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("SDK instance must have an api() method");
      }
    });

    it("should throw error for SDK instance with non-function api property", () => {
      try {
        createSemanticAPI({ api: "not a function" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("SDK instance must have an api() method");
      }
    });
  });

  describe("API class exports", () => {
    it("should export BoardsAPI class", () => {
      expect(BoardsAPI).to.be.a("function");

      const mockApiClient = sinon.stub();
      const boardsAPI = new BoardsAPI(mockApiClient);

      expect(boardsAPI).to.be.instanceOf(BoardsAPI);
      expect(boardsAPI).to.have.property("createBoard");
      expect(boardsAPI).to.have.property("getBoard");
      expect(boardsAPI).to.have.property("getBoards");
      expect(boardsAPI).to.have.property("updateBoard");
      expect(boardsAPI).to.have.property("deleteBoard");
      expect(boardsAPI).to.have.property("duplicateBoard");
    });

    it("should export ItemsAPI class", () => {
      expect(ItemsAPI).to.be.a("function");

      const mockApiClient = sinon.stub();
      const itemsAPI = new ItemsAPI(mockApiClient);

      expect(itemsAPI).to.be.instanceOf(ItemsAPI);
      expect(itemsAPI).to.have.property("createItem");
      expect(itemsAPI).to.have.property("getItem");
      expect(itemsAPI).to.have.property("getItems");
      expect(itemsAPI).to.have.property("updateItem");
      expect(itemsAPI).to.have.property("deleteItem");
      expect(itemsAPI).to.have.property("duplicateItem");
      expect(itemsAPI).to.have.property("moveItemToBoard");
      expect(itemsAPI).to.have.property("updateItemColumnValues");
    });

    it("should export ColumnsAPI class", () => {
      expect(ColumnsAPI).to.be.a("function");

      const mockApiClient = sinon.stub();
      const columnsAPI = new ColumnsAPI(mockApiClient);

      expect(columnsAPI).to.be.instanceOf(ColumnsAPI);
      expect(columnsAPI).to.have.property("getColumns");
      expect(columnsAPI).to.have.property("createColumn");
      expect(columnsAPI).to.have.property("updateColumn");
      expect(columnsAPI).to.have.property("deleteColumn");
      expect(columnsAPI).to.have.property("changeColumnValue");
      expect(columnsAPI).to.have.property("changeSimpleColumnValue");
    });
  });

  describe("Integration with different SDK instances", () => {
    it("should work with client SDK instance", () => {
      const clientSDK = {
        api: sinon.stub().resolves({ data: {} }),
        _clientId: "test-client",
        _apiToken: "test-token"
      };

      const semanticAPI = createSemanticAPI(clientSDK);

      expect(semanticAPI.boards).to.be.instanceOf(BoardsAPI);
      expect(semanticAPI.items).to.be.instanceOf(ItemsAPI);
      expect(semanticAPI.columns).to.be.instanceOf(ColumnsAPI);
    });

    it("should work with server SDK instance", () => {
      const serverSDK = {
        api: sinon.stub().resolves({ data: {} }),
        _token: "test-token",
        _apiVersion: "2023-10"
      };

      const semanticAPI = createSemanticAPI(serverSDK);

      expect(semanticAPI.boards).to.be.instanceOf(BoardsAPI);
      expect(semanticAPI.items).to.be.instanceOf(ItemsAPI);
      expect(semanticAPI.columns).to.be.instanceOf(ColumnsAPI);
    });
  });

  describe("API method binding", () => {
    it("should properly bind API client methods", async () => {
      const semanticAPI = createSemanticAPI(mockSDKInstance);

      // Mock responses for different API calls
      mockSDKInstance.api
        .onFirstCall()
        .resolves({ data: { boards: [] } })
        .onSecondCall()
        .resolves({ data: { items: [] } })
        .onThirdCall()
        .resolves({ data: { boards: [{ columns: [] }] } });

      // Call methods from different API modules
      await semanticAPI.boards.getBoards();
      await semanticAPI.items.getItems();
      await semanticAPI.columns.getColumns("123");

      expect(mockSDKInstance.api).to.have.been.calledThrice;
    });

    it("should maintain SDK context across API calls", async () => {
      const sdkInstance = {
        api: sinon.stub().resolves({ data: {} }),
        someProperty: "test-value"
      };

      const semanticAPI = createSemanticAPI(sdkInstance);

      // Verify that the API client has access to the SDK context
      await semanticAPI.boards.getBoards();

      // The API should have been called with the correct context
      expect(sdkInstance.api).to.have.been.calledOnce;
    });
  });
});
