/**
 * Monday.com SDK Semantic API Usage Examples
 *
 * This file demonstrates how to use the new high-level semantic API layer
 * for common Monday.com operations.
 */

const mondaySDK = require("../src/index");

// Initialize the SDK (works with both client and server environments)
const monday = mondaySDK({
  token: "your-api-token-here"
});

async function demonstrateSemanticAPI() {
  try {
    console.log("🚀 Monday.com Semantic API Demo\n");

    // =====================================
    // BOARD OPERATIONS
    // =====================================
    console.log("📋 Board Operations:");

    // Create a new board
    const newBoard = await monday.boards.createBoard("My Project Board", "public", {
      description: "A board for tracking project tasks",
      includeColumns: true
    });
    console.log("✅ Created board:", newBoard.name, `(ID: ${newBoard.id})`);

    // Get multiple boards
    const boards = await monday.boards.getBoards({
      limit: 5,
      state: "active",
      includeColumns: true
    });
    console.log("📊 Retrieved boards:", boards.length);

    // Get a specific board with full details
    const board = await monday.boards.getBoard(newBoard.id, {
      includeColumns: true,
      includeGroups: true
    });
    console.log("🔍 Board details:", board.name, `has ${board.columns?.length || 0} columns`);

    // =====================================
    // ITEM OPERATIONS
    // =====================================
    console.log("\n📝 Item Operations:");

    // Create a new item with column values
    const newItem = await monday.items.createItem(
      board.id,
      "Setup project infrastructure",
      {
        status: { label: "Working on it" },
        text: "Configure development environment and CI/CD pipeline",
        priority: { label: "High" }
      },
      {
        includeColumnValues: true
      }
    );
    console.log("✅ Created item:", newItem.name, `(ID: ${newItem.id})`);

    // Create another item
    const secondItem = await monday.items.createItem(board.id, "Design user interface", {
      status: { label: "Stuck" },
      text: "Create wireframes and mockups for the main dashboard"
    });
    console.log("✅ Created item:", secondItem.name, `(ID: ${secondItem.id})`);

    // Get all items from the board
    const items = await monday.items.getItems(board.id, {
      includeColumnValues: true,
      limit: 10
    });
    console.log("📋 Board items:", items.length);

    // Update item column values
    const updatedItem = await monday.items.updateItemColumnValues(newItem.id, {
      status: { label: "Done" },
      text: "Infrastructure setup completed successfully!"
    });
    console.log("🔄 Updated item status to Done");

    // Create a subitem
    const subitem = await monday.items.createSubitem(newItem.id, "Deploy staging environment", {
      status: { label: "Working on it" }
    });
    console.log("📎 Created subitem:", subitem.name);

    // =====================================
    // COLUMN OPERATIONS
    // =====================================
    console.log("\n🏛️ Column Operations:");

    // Get all columns from the board
    const columns = await monday.columns.getColumns(board.id);
    console.log("📊 Board columns:", columns.map(col => `${col.title} (${col.type})`).join(", "));

    // Create a new column
    const newColumn = await monday.columns.createColumn(board.id, {
      title: "Estimated Hours",
      type: "numeric",
      description: "Time estimation for completing this task"
    });
    console.log("✅ Created column:", newColumn.title);

    // Update a column value for an item
    const itemWithNewColumn = await monday.columns.changeSimpleColumnValue(newItem.id, newColumn.id, "8");
    console.log("🔢 Set estimated hours to 8 for item:", itemWithNewColumn.name);

    // Get specific column values for an item
    const columnValues = await monday.columns.getItemColumnValues(newItem.id, {
      columnIds: ["status", newColumn.id]
    });
    console.log(
      "📋 Item column values:",
      columnValues.map(cv => `${cv.title}: ${cv.text || cv.value}`)
    );

    // =====================================
    // ADVANCED OPERATIONS
    // =====================================
    console.log("\n🔧 Advanced Operations:");

    // Duplicate an item to another board
    const duplicatedItem = await monday.items.duplicateItem(newItem.id);
    console.log("📄 Duplicated item:", duplicatedItem.name);

    // Get board activity
    const boardActivity = await monday.boards.getBoardActivity(board.id, {
      limit: 5
    });
    console.log("📈 Recent board activity:", boardActivity.length, "updates");

    // Archive an item
    const archivedItem = await monday.items.archiveItem(secondItem.id);
    console.log("🗄️ Archived item:", archivedItem.id);

    // Get available column types
    const columnTypes = await monday.columns.getColumnTypes();
    console.log(
      "🎨 Available column types:",
      columnTypes
        .slice(0, 5)
        .map(ct => ct.name)
        .join(", ")
    );

    console.log("\n🎉 Semantic API demo completed successfully!");
  } catch (error) {
    console.error("❌ Error in semantic API demo:", error.message);

    // More detailed error information for debugging
    if (error.data) {
      console.error("Error details:", error.data);
    }
  }
}

// =====================================
// TYPED USAGE (TypeScript)
// =====================================

/**
 * TypeScript usage example (when using .ts files):
 *
 * import mondaySDK, { Board, Item, Column } from 'monday-sdk-js';
 *
 * const monday = mondaySDK({ token: 'your-token' });
 *
 * // Type-safe board creation
 * const board: Board = await monday.boards.createBoard('Typed Board', 'public');
 *
 * // Type-safe item creation with proper column value types
 * const item: Item = await monday.items.createItem(board.id, 'Typed Item', {
 *   status: 'Working on it',
 *   priority: 'High',
 *   date: '2024-01-15'
 * });
 *
 * // Type-safe column operations
 * const columns: Column[] = await monday.columns.getColumns(board.id);
 */

// =====================================
// ERROR HANDLING PATTERNS
// =====================================

async function errorHandlingExample() {
  try {
    // This will throw a clear error message
    await monday.boards.createBoard(); // Missing required name parameter
  } catch (error) {
    console.log("Validation error:", error.message);
    // Output: "Board name is required and must be a string"
  }

  try {
    // This will throw an error if the board doesn't exist
    await monday.boards.getBoard("non-existent-board-id");
  } catch (error) {
    console.log("API error:", error.message);
    // Handle GraphQL API errors appropriately
  }
}

// =====================================
// PAGINATION EXAMPLE
// =====================================

async function paginationExample() {
  const allItems = [];
  let page = 1;
  const limit = 25;

  while (true) {
    const items = await monday.items.getItems("your-board-id", {
      page: page,
      limit: limit,
      includeColumnValues: true
    });

    if (items.length === 0) break;

    allItems.push(...items);
    page++;

    // Prevent infinite loops in case of API issues
    if (page > 100) break;
  }

  console.log(`Retrieved ${allItems.length} total items across ${page - 1} pages`);
}

// Run the demo if this file is executed directly
if (require.main === module) {
  console.log('⚠️  To run this demo, replace "your-api-token-here" with a valid Monday.com API token');
  console.log("💡 You can get your API token from: https://monday.com/developers/v2/docs/authentication");
  console.log("🚫 Demo will not run with placeholder token\n");

  // Uncomment the line below to run the demo with a real token
  // demonstrateSemanticAPI();
}

module.exports = {
  demonstrateSemanticAPI,
  errorHandlingExample,
  paginationExample
};
