const { sinon, expect } = require("../tests/helpers");
const BoardsAPI = require("./boards");

describe("BoardsAPI", () => {
  let mockApiClient;
  let boardsAPI;

  beforeEach(() => {
    mockApiClient = sinon.stub();
    boardsAPI = new BoardsAPI(mockApiClient);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createBoard", () => {
    it("should create a board with basic parameters", async () => {
      const mockResponse = {
        data: {
          create_board: {
            id: "123",
            name: "Test Board",
            board_kind: "public"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.createBoard("Test Board");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation CreateBoard");
      expect(query).to.include("create_board");
      expect(options.variables).to.deep.equal({
        boardName: "Test Board",
        boardKind: "public"
      });
      expect(result).to.deep.equal(mockResponse.data.create_board);
    });

    it("should create a board with all options", async () => {
      const mockResponse = {
        data: {
          create_board: {
            id: "123",
            name: "Test Board",
            description: "Test Description"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        description: "Test Description",
        folderId: 456,
        workspaceId: 789,
        templateId: "template123"
      };

      await boardsAPI.createBoard("Test Board", "private", options);

      const [query, callOptions] = mockApiClient.firstCall.args;
      expect(callOptions.variables).to.deep.equal({
        boardName: "Test Board",
        boardKind: "private",
        description: "Test Description",
        folderId: 456,
        workspaceId: 789,
        templateId: "template123"
      });
    });

    it("should throw error for missing name", async () => {
      try {
        await boardsAPI.createBoard();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board name is required and must be a string");
      }
    });
  });

  describe("getBoard", () => {
    it("should get a board by ID", async () => {
      const mockResponse = {
        data: {
          boards: [
            {
              id: "123",
              name: "Test Board"
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.getBoard("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetBoard");
      expect(options.variables).to.deep.equal({ boardId: "123" });
      expect(result).to.deep.equal(mockResponse.data.boards[0]);
    });

    it("should return null for non-existent board", async () => {
      const mockResponse = {
        data: {
          boards: []
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.getBoard("999");

      expect(result).to.be.null;
    });

    it("should throw error for missing board ID", async () => {
      try {
        await boardsAPI.getBoard();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });
  });

  describe("getBoards", () => {
    it("should get multiple boards", async () => {
      const mockResponse = {
        data: {
          boards: [
            { id: "123", name: "Board 1" },
            { id: "456", name: "Board 2" }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.getBoards();

      expect(mockApiClient).to.have.been.calledOnce;
      const [query] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetBoards");
      expect(result).to.deep.equal(mockResponse.data.boards);
    });

    it("should get boards with options", async () => {
      const mockResponse = {
        data: {
          boards: [{ id: "123", name: "Board 1" }]
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        ids: ["123", "456"],
        limit: 10,
        state: "active"
      };

      await boardsAPI.getBoards(options);

      const [query, callOptions] = mockApiClient.firstCall.args;
      expect(callOptions.variables).to.deep.equal({
        ids: ["123", "456"],
        limit: 10,
        state: "active"
      });
    });
  });

  describe("updateBoard", () => {
    it("should update board name", async () => {
      const mockResponse = {
        data: {
          update_board: { id: "123" },
          boards: [
            {
              id: "123",
              name: "Updated Board"
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.updateBoard("123", { name: "Updated Board" });

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation UpdateBoard");
      expect(options.variables).to.deep.equal({
        boardId: "123",
        name: "Updated Board"
      });
      expect(result).to.deep.equal(mockResponse.data.boards[0]);
    });

    it("should throw error for missing board ID", async () => {
      try {
        await boardsAPI.updateBoard();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });

    it("should throw error for empty updates", async () => {
      try {
        await boardsAPI.updateBoard("123", {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Updates object cannot be empty");
      }
    });
  });

  describe("deleteBoard", () => {
    it("should delete a board", async () => {
      const mockResponse = {
        data: {
          archive_board: {
            id: "123",
            state: "archived"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.deleteBoard("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation DeleteBoard");
      expect(options.variables).to.deep.equal({ boardId: "123" });
      expect(result).to.deep.equal(mockResponse.data.archive_board);
    });

    it("should throw error for missing board ID", async () => {
      try {
        await boardsAPI.deleteBoard();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });
  });

  describe("duplicateBoard", () => {
    it("should duplicate a board", async () => {
      const mockResponse = {
        data: {
          duplicate_board: {
            board: {
              id: "789",
              name: "Copy of Test Board"
            }
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.duplicateBoard("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation DuplicateBoard");
      expect(options.variables).to.deep.equal({
        boardId: "123",
        duplicateType: "duplicate_board_with_structure"
      });
      expect(result).to.deep.equal(mockResponse.data.duplicate_board.board);
    });

    it("should duplicate a board with options", async () => {
      const mockResponse = {
        data: {
          duplicate_board: {
            board: {
              id: "789",
              name: "New Board Name"
            }
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        boardName: "New Board Name",
        workspaceId: 456
      };

      await boardsAPI.duplicateBoard("123", options);

      const [query, callOptions] = mockApiClient.firstCall.args;
      expect(callOptions.variables).to.deep.equal({
        boardId: "123",
        duplicateType: "duplicate_board_with_structure",
        boardName: "New Board Name",
        workspaceId: 456
      });
    });

    it("should throw error for missing board ID", async () => {
      try {
        await boardsAPI.duplicateBoard();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });
  });

  describe("getBoardActivity", () => {
    it("should get board activity", async () => {
      const mockResponse = {
        data: {
          boards: [
            {
              updates: [
                {
                  id: "1",
                  body: "Update 1",
                  created_at: "2024-01-01T00:00:00Z"
                }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.getBoardActivity("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetBoardActivity");
      expect(options.variables).to.deep.equal({ boardId: "123" });
      expect(result).to.deep.equal(mockResponse.data.boards[0].updates);
    });

    it("should return empty array for board without activity", async () => {
      const mockResponse = {
        data: {
          boards: []
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await boardsAPI.getBoardActivity("123");

      expect(result).to.deep.equal([]);
    });

    it("should throw error for missing board ID", async () => {
      try {
        await boardsAPI.getBoardActivity();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });
  });
});
