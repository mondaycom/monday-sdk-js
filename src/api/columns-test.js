const { sinon, expect } = require("../tests/helpers");
const ColumnsAPI = require("./columns");

describe("ColumnsAPI", () => {
  let mockApiClient;
  let columnsAPI;

  beforeEach(() => {
    mockApiClient = sinon.stub();
    columnsAPI = new ColumnsAPI(mockApiClient);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getColumns", () => {
    it("should get columns for a board", async () => {
      const mockResponse = {
        data: {
          boards: [
            {
              columns: [
                { id: "status", title: "Status", type: "color", archived: false },
                { id: "text", title: "Text", type: "text", archived: false }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.getColumns("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetColumns");
      expect(options.variables).to.deep.equal({ boardId: "123" });
      expect(result).to.deep.equal(mockResponse.data.boards[0].columns);
    });

    it("should filter columns by type", async () => {
      const mockResponse = {
        data: {
          boards: [
            {
              columns: [
                { id: "status", title: "Status", type: "color", archived: false },
                { id: "text", title: "Text", type: "text", archived: false },
                { id: "date", title: "Date", type: "date", archived: false }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        types: ["color", "date"]
      };

      const result = await columnsAPI.getColumns("123", options);

      expect(result).to.have.length(2);
      expect(result[0].type).to.equal("color");
      expect(result[1].type).to.equal("date");
    });

    it("should exclude archived columns by default", async () => {
      const mockResponse = {
        data: {
          boards: [
            {
              columns: [
                { id: "status", title: "Status", type: "color", archived: false },
                { id: "old_text", title: "Old Text", type: "text", archived: true }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.getColumns("123");

      expect(result).to.have.length(1);
      expect(result[0].archived).to.be.false;
    });

    it("should include archived columns when requested", async () => {
      const mockResponse = {
        data: {
          boards: [
            {
              columns: [
                { id: "status", title: "Status", type: "color", archived: false },
                { id: "old_text", title: "Old Text", type: "text", archived: true }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        includeArchived: true
      };

      const result = await columnsAPI.getColumns("123", options);

      expect(result).to.have.length(2);
    });

    it("should throw error for missing board ID", async () => {
      try {
        await columnsAPI.getColumns();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });
  });

  describe("createColumn", () => {
    it("should create a column with basic parameters", async () => {
      const mockResponse = {
        data: {
          create_column: {
            id: "new_status",
            title: "New Status",
            type: "color"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const columnData = {
        title: "New Status",
        type: "color"
      };

      const result = await columnsAPI.createColumn("123", columnData);

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation CreateColumn");
      expect(options.variables).to.deep.equal({
        boardId: "123",
        columnType: "color",
        columnTitle: "New Status"
      });
      expect(result).to.deep.equal(mockResponse.data.create_column);
    });

    it("should create a column with all options", async () => {
      const mockResponse = {
        data: {
          create_column: {
            id: "custom_col",
            title: "Custom Column",
            type: "text"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const columnData = {
        title: "Custom Column",
        type: "text",
        description: "A custom text column",
        id: "custom_col",
        defaults: { width: 150 }
      };

      await columnsAPI.createColumn("123", columnData);

      const [query, options] = mockApiClient.firstCall.args;
      expect(options.variables).to.deep.equal({
        boardId: "123",
        columnType: "text",
        columnTitle: "Custom Column",
        description: "A custom text column",
        columnId: "custom_col",
        defaults: JSON.stringify({ width: 150 })
      });
    });

    it("should throw error for missing board ID", async () => {
      try {
        await columnsAPI.createColumn();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Board ID is required");
      }
    });

    it("should throw error for missing column data", async () => {
      try {
        await columnsAPI.createColumn("123", {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column title and type are required");
      }
    });
  });

  describe("updateColumn", () => {
    it("should update column title", async () => {
      const mockResponse = {
        data: {
          change_column_title: { id: "status" },
          columns: [
            {
              id: "status",
              title: "Updated Status",
              type: "color"
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.updateColumn("status", { title: "Updated Status" });

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation UpdateColumn");
      expect(options.variables).to.deep.equal({
        columnId: "status",
        title: "Updated Status"
      });
      expect(result).to.deep.equal(mockResponse.data.columns[0]);
    });

    it("should update column description", async () => {
      const mockResponse = {
        data: {
          change_column_metadata: { id: "status" },
          columns: [
            {
              id: "status",
              title: "Status",
              description: "Updated description"
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      await columnsAPI.updateColumn("status", { description: "Updated description" });

      const [query, options] = mockApiClient.firstCall.args;
      expect(options.variables).to.deep.equal({
        columnId: "status",
        description: "Updated description"
      });
    });

    it("should throw error for missing column ID", async () => {
      try {
        await columnsAPI.updateColumn();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column ID is required");
      }
    });

    it("should throw error for empty updates", async () => {
      try {
        await columnsAPI.updateColumn("status", {});
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Updates object cannot be empty");
      }
    });
  });

  describe("deleteColumn", () => {
    it("should delete a column", async () => {
      const mockResponse = {
        data: {
          delete_column: {
            id: "status",
            archived: true
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.deleteColumn("status");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation DeleteColumn");
      expect(options.variables).to.deep.equal({ columnId: "status" });
      expect(result).to.deep.equal(mockResponse.data.delete_column);
    });

    it("should throw error for missing column ID", async () => {
      try {
        await columnsAPI.deleteColumn();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column ID is required");
      }
    });
  });

  describe("changeColumnValue", () => {
    it("should change a column value", async () => {
      const mockResponse = {
        data: {
          change_column_value: {
            id: "123",
            name: "Test Item",
            column_values: [{ id: "status", text: "Done", value: "1" }]
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.changeColumnValue("123", "status", "Done");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation ChangeColumnValue");
      expect(options.variables).to.deep.equal({
        itemId: "123",
        columnId: "status",
        value: "Done"
      });
      expect(result).to.deep.equal(mockResponse.data.change_column_value);
    });

    it("should change a complex column value", async () => {
      const mockResponse = {
        data: {
          change_column_value: {
            id: "123",
            name: "Test Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const complexValue = { label: "Working on it", index: 1 };

      await columnsAPI.changeColumnValue("123", "status", complexValue);

      const [query, options] = mockApiClient.firstCall.args;
      expect(options.variables).to.deep.equal({
        itemId: "123",
        columnId: "status",
        value: JSON.stringify(complexValue)
      });
    });

    it("should throw error for missing item ID", async () => {
      try {
        await columnsAPI.changeColumnValue();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });

    it("should throw error for missing column ID", async () => {
      try {
        await columnsAPI.changeColumnValue("123");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column ID is required");
      }
    });

    it("should throw error for missing value", async () => {
      try {
        await columnsAPI.changeColumnValue("123", "status");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column value is required");
      }
    });
  });

  describe("changeSimpleColumnValue", () => {
    it("should change a simple column value", async () => {
      const mockResponse = {
        data: {
          change_simple_column_value: {
            id: "123",
            name: "Test Item",
            column_values: [{ id: "text", text: "Updated text", value: "Updated text" }]
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.changeSimpleColumnValue("123", "text", "Updated text");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation ChangeSimpleColumnValue");
      expect(options.variables).to.deep.equal({
        itemId: "123",
        columnId: "text",
        value: "Updated text"
      });
      expect(result).to.deep.equal(mockResponse.data.change_simple_column_value);
    });

    it("should handle numeric values", async () => {
      const mockResponse = {
        data: {
          change_simple_column_value: {
            id: "123",
            name: "Test Item"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      await columnsAPI.changeSimpleColumnValue("123", "numbers", 42);

      const [query, options] = mockApiClient.firstCall.args;
      expect(options.variables).to.deep.equal({
        itemId: "123",
        columnId: "numbers",
        value: "42"
      });
    });

    it("should throw error for missing item ID", async () => {
      try {
        await columnsAPI.changeSimpleColumnValue();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });
  });

  describe("getItemColumnValues", () => {
    it("should get all column values for an item", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              column_values: [
                { id: "status", text: "Working on it", value: "1" },
                { id: "text", text: "Some text", value: "Some text" }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.getItemColumnValues("123");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetItemColumnValues");
      expect(options.variables).to.deep.equal({ itemId: "123" });
      expect(result).to.deep.equal(mockResponse.data.items[0].column_values);
    });

    it("should filter column values by IDs", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              column_values: [
                { id: "status", text: "Working on it", value: "1" },
                { id: "text", text: "Some text", value: "Some text" },
                { id: "date", text: "2024-01-01", value: "2024-01-01" }
              ]
            }
          ]
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        columnIds: ["status", "date"]
      };

      const result = await columnsAPI.getItemColumnValues("123", options);

      expect(result).to.have.length(2);
      expect(result[0].id).to.equal("status");
      expect(result[1].id).to.equal("date");
    });

    it("should return empty array for item without column values", async () => {
      const mockResponse = {
        data: {
          items: []
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.getItemColumnValues("123");

      expect(result).to.deep.equal([]);
    });

    it("should throw error for missing item ID", async () => {
      try {
        await columnsAPI.getItemColumnValues();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });
  });

  describe("clearColumnValue", () => {
    it("should clear a column value", async () => {
      const mockResponse = {
        data: {
          change_column_value: {
            id: "123",
            name: "Test Item",
            column_values: [{ id: "status", text: "", value: "" }]
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.clearColumnValue("123", "status");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation ClearColumnValue");
      expect(options.variables).to.deep.equal({
        itemId: "123",
        columnId: "status"
      });
      expect(result).to.deep.equal(mockResponse.data.change_column_value);
    });

    it("should throw error for missing item ID", async () => {
      try {
        await columnsAPI.clearColumnValue();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Item ID is required");
      }
    });

    it("should throw error for missing column ID", async () => {
      try {
        await columnsAPI.clearColumnValue("123");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column ID is required");
      }
    });
  });

  describe("getColumnTypes", () => {
    it("should get all column types", async () => {
      const mockResponse = {
        data: {
          __type: {
            enumValues: [
              { name: "text", description: "Text column" },
              { name: "color", description: "Status/color column" },
              { name: "date", description: "Date column" }
            ]
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.getColumnTypes();

      expect(mockApiClient).to.have.been.calledOnce;
      const [query] = mockApiClient.firstCall.args;
      expect(query).to.include("query GetColumnTypes");
      expect(result).to.deep.equal(mockResponse.data.__type.enumValues);
    });

    it("should return empty array if no types found", async () => {
      const mockResponse = {
        data: {
          __type: null
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.getColumnTypes();

      expect(result).to.deep.equal([]);
    });
  });

  describe("duplicateColumn", () => {
    it("should duplicate a column", async () => {
      const mockResponse = {
        data: {
          duplicate_column: {
            id: "new_status",
            title: "Copy of Status",
            type: "color"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const result = await columnsAPI.duplicateColumn("status", "456");

      expect(mockApiClient).to.have.been.calledOnce;
      const [query, options] = mockApiClient.firstCall.args;
      expect(query).to.include("mutation DuplicateColumn");
      expect(options.variables).to.deep.equal({
        columnId: "status",
        boardId: "456"
      });
      expect(result).to.deep.equal(mockResponse.data.duplicate_column);
    });

    it("should duplicate a column with custom title", async () => {
      const mockResponse = {
        data: {
          duplicate_column: {
            id: "new_status",
            title: "Custom Status",
            type: "color"
          }
        }
      };
      mockApiClient.resolves(mockResponse);

      const options = {
        title: "Custom Status"
      };

      await columnsAPI.duplicateColumn("status", "456", options);

      const [query, callOptions] = mockApiClient.firstCall.args;
      expect(callOptions.variables).to.deep.equal({
        columnId: "status",
        boardId: "456",
        title: "Custom Status"
      });
    });

    it("should throw error for missing column ID", async () => {
      try {
        await columnsAPI.duplicateColumn();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Column ID is required");
      }
    });

    it("should throw error for missing target board ID", async () => {
      try {
        await columnsAPI.duplicateColumn("status");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.equal("Target board ID is required");
      }
    });
  });
});
