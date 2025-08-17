const { sinon, expect } = require("../tests/helpers");
const ItemsAPI = require("./items");

describe("ItemsAPI", () => {
  let mockApiClient;
  let itemsAPI;

  beforeEach(() => {
    mockApiClient = sinon.stub();
    itemsAPI = new ItemsAPI(mockApiClient);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createItem", () => {
    it("should create an item with basic parameters", async () => {
      const mockResponse = {
        data: {
          create_item: {
            id: "123",
            name: "Test Item",
            board: { id: "456", name: "Test Board" }
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.createItem("456", "Test Item");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation CreateItem");
      expect(query).to.include("create_item");
      expect(options.variables).to.deep.equal({
        boardId: "456",
        itemName: "Test Item"
      });
      expect(result).to.deep.equal(mockResponse.data.create_item);
    });

    it("should create an item with column values", async () => {
      const mockResponse = {
        data: {
          create_item: {
            id: "123",
            name: "Test Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const columnValues = {
        status: "Working on it",
        text: "Some description"
      };

      await itemsAPI.createItem("456", "Test Item", columnValues);

      const [query, options] = mockApiClient.firstCall.args;
      expect(options.variables).to.deep.equal({
        boardId: "456",
        itemName: "Test Item",
        columnValues: JSON.stringify(columnValues)
      });
    });

    it("should create an item with options", async () => {
      const mockResponse = {
        data: {
          create_item: {
            id: "123",
            name: "Test Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        groupId: "group123",
        createLabelsIfMissing: true
      };

      await itemsAPI.createItem("456", "Test Item", {}, options);

      const [query, callOptions] = mockApiClient.firstCall.args;
      expect(callOptions.variables).to.deep.equal({
        boardId: "456",
        itemName: "Test Item",
        groupId: "group123",
        createLabelsIfMissing: true
      });
    });

    it("should throw error for missing board ID", async () => {
      try {
        await itemsAPI.createItem();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });

    it("should throw error for missing item name", async () => {
      try {
        await itemsAPI.createItem("456");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item name is required and must be a string");
      }
    });
  });

  describe("getItem", () => {
    it("should get an item by ID", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: "123",
              name: "Test Item"
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.getItem("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetItem");
      expect(options.variables).to.deep.equal({ itemId: "123" });
      expect(result).to.deep.equal(mockResponse.data.items[0]);
    });

    it("should return null for non-existent item", async () => {
      const mockResponse = {
        data: {
          items: []
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.getItem("999");

      expect(result).to.be.null;
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.getItem();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });
  });

  describe("getItems", () => {
    it("should get items from a specific board", async () => {
      const mockResponse = {
        data: {
          boards: [
            {
              items_page: {
                items: [
                  { id: "123", name: "Item 1" },
                  { id: "456", name: "Item 2" }
                ]
              }
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.getItems("789");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetItems");
      expect(options.variables).to.deep.equal({ boardId: "789" });
      expect(result).to.deep.equal(mockResponse.data.boards[0].items_page.items);
    });

    it("should get all items without board filter", async () => {
      const mockResponse = {
        data: {
          items: [
            { id: "123", name: "Item 1" },
            { id: "456", name: "Item 2" }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.getItems();

      expect(mockApiClient).to.have.been.calledOnce;
      const [query] = mockApiClient.firstCall.args;
      expect(query).to.include("items(");
      expect(result).to.deep.equal(mockResponse.data.items);
    });

    it("should get items with options", async () => {
      const mockResponse = {
        data: {
          items: [{ id: "123", name: "Item 1" }]
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        ids: ["123", "456"],
        limit: 10,
        newest_first: true
      };

      await itemsAPI.getItems(null, options);

      const [query, callOptions] = mockApiClient.firstCall.args;
      expect(callOptions.variables).to.deep.equal({
        ids: ["123", "456"],
        limit: 10,
        newest_first: true
      });
    });
  });

  describe("updateItem", () => {
    it("should update item name", async () => {
      const mockResponse = {
        data: {
          change_simple_column_value: {
            id: "123",
            name: "Updated Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.updateItem("123", { name: "Updated Item" });

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation UpdateItem");
      expect(options.variables).to.deep.equal({
        itemId: "123",
        itemName: "Updated Item"
      });
      expect(result).to.deep.equal(mockResponse.data.change_simple_column_value);
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.updateItem();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });

    it("should throw error for missing name", async () => {
      try {
        await itemsAPI.updateItem("123", { someOtherProperty: "value" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item name is required for updates");
      }
    });
  });

  describe("deleteItem", () => {
    it("should delete an item", async () => {
      const mockResponse = {
        data: {
          delete_item: {
            id: "123"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.deleteItem("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation DeleteItem");
      expect(options.variables).to.deep.equal({ itemId: "123" });
      expect(result).to.deep.equal(mockResponse.data.delete_item);
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.deleteItem();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });
  });

  describe("duplicateItem", () => {
    it("should duplicate an item", async () => {
      const mockResponse = {
        data: {
          duplicate_item: {
            id: "789",
            name: "Copy of Test Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.duplicateItem("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation DuplicateItem");
      expect(options.variables).to.deep.equal({
        itemId: "123"
      });
      expect(result).to.deep.equal(mockResponse.data.duplicate_item);
    });

    it("should duplicate an item with options", async () => {
      const mockResponse = {
        data: {
          duplicate_item: {
            id: "789",
            name: "Copy of Test Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        boardId: "456",
        withUpdates: true
      };

      await itemsAPI.duplicateItem("123", options);

      const [query, callOptions] = mockApiClient.firstCall.args;
      expect(callOptions.variables).to.deep.equal({
        itemId: "123",
        boardId: "456",
        withUpdates: true
      });
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.duplicateItem();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });
  });

  describe("moveItemToBoard", () => {
    it("should move an item to another board", async () => {
      const mockResponse = {
        data: {
          move_item_to_board: {
            id: "123",
            name: "Moved Item",
            board: { id: "456", name: "Target Board" }
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.moveItemToBoard("123", "456");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation MoveItemToBoard");
      expect(options.variables).to.deep.equal({
        itemId: "123",
        boardId: "456"
      });
      expect(result).to.deep.equal(mockResponse.data.move_item_to_board);
    });

    it("should move an item with group ID", async () => {
      const mockResponse = {
        data: {
          move_item_to_board: {
            id: "123",
            name: "Moved Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      await itemsAPI.moveItemToBoard("123", "456", "group789");

      const [query, options] = mockApiClient.firstCall.args;
      expect(options.variables).to.deep.equal({
        itemId: "123",
        boardId: "456",
        groupId: "group789"
      });
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.moveItemToBoard();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });

    it("should throw error for missing target board ID", async () => {
      try {
        await itemsAPI.moveItemToBoard("123");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Target board ID is required");
      }
    });
  });

  describe("updateItemColumnValues", () => {
    it("should update multiple column values", async () => {
      const mockResponse = {
        data: {
          change_multiple_column_values: {
            id: "123",
            name: "Test Item",
            column_values: [
              { id: "status", text: "Working on it" },
              { id: "text", text: "Updated description" }
            ]
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const columnValues = {
        status: "Working on it",
        text: "Updated description"
      };

      const result = await itemsAPI.updateItemColumnValues("123", columnValues);

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation UpdateItemColumnValues");
      expect(options.variables).to.deep.equal({
        itemId: "123",
        columnValues: JSON.stringify(columnValues)
      });
      expect(result).to.deep.equal(mockResponse.data.change_multiple_column_values);
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.updateItemColumnValues();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });

    it("should throw error for empty column values", async () => {
      try {
        await itemsAPI.updateItemColumnValues("123", {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column values object cannot be empty");
      }
    });
  });

  describe("archiveItem", () => {
    it("should archive an item", async () => {
      const mockResponse = {
        data: {
          archive_item: {
            id: "123",
            state: "archived"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.archiveItem("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation ArchiveItem");
      expect(options.variables).to.deep.equal({ itemId: "123" });
      expect(result).to.deep.equal(mockResponse.data.archive_item);
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.archiveItem();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });
  });

  describe("createSubitem", () => {
    it("should create a subitem", async () => {
      const mockResponse = {
        data: {
          create_subitem: {
            id: "789",
            name: "Test Subitem"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.createSubitem("123", "Test Subitem");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation CreateSubitem");
      expect(options.variables).to.deep.equal({
        parentItemId: "123",
        itemName: "Test Subitem"
      });
      expect(result).to.deep.equal(mockResponse.data.create_subitem);
    });

    it("should create a subitem with column values", async () => {
      const mockResponse = {
        data: {
          create_subitem: {
            id: "789",
            name: "Test Subitem"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const columnValues = {
        status: "Working on it"
      };

      await itemsAPI.createSubitem("123", "Test Subitem", columnValues);

      const [query, options] = mockApiClient.firstCall.args;
      expect(options.variables).to.deep.equal({
        parentItemId: "123",
        itemName: "Test Subitem",
        columnValues: JSON.stringify(columnValues)
      });
    });

    it("should throw error for missing parent item ID", async () => {
      try {
        await itemsAPI.createSubitem();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Parent item ID is required");
      }
    });

    it("should throw error for missing subitem name", async () => {
      try {
        await itemsAPI.createSubitem("123");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Subitem name is required and must be a string");
      }
    });
  });

  describe("getItemActivity", () => {
    it("should get item activity", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              updates: [
                {
                  id: "1",
                  body: "Item update",
                  created_at: "2024-01-01T00:00:00Z"
                }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.getItemActivity("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetItemActivity");
      expect(options.variables).to.deep.equal({ itemId: "123" });
      expect(result).to.deep.equal(mockResponse.data.items[0].updates);
    });

    it("should return empty array for item without activity", async () => {
      const mockResponse = {
        data: {
          items: []
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await itemsAPI.getItemActivity("123");

      expect(result).to.deep.equal([]);
    });

    it("should throw error for missing item ID", async () => {
      try {
        await itemsAPI.getItemActivity();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });
  });
});
