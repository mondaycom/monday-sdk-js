# Monday.com SDK Semantic API Layer

This document describes the new high-level semantic API layer built on top of the Monday.com SDK's GraphQL API. The semantic API provides intuitive CRUD operations for boards, items, and columns, making it easier to work with Monday.com programmatically.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Boards API](#boards-api)
- [Items API](#items-api)
- [Columns API](#columns-api)
- [TypeScript Support](#typescript-support)
- [Error Handling](#error-handling)
- [Migration Guide](#migration-guide)

## Overview

The semantic API layer provides three main modules:

- **Boards API**: Create, read, update, and delete boards
- **Items API**: Manage items, subitems, and their properties
- **Columns API**: Handle columns and column values

### Key Benefits

- **Intuitive method names**: `createBoard()`, `getItems()`, `updateColumnValue()`
- **Built-in validation**: Parameter validation with helpful error messages
- **Sensible defaults**: Pre-configured field selections for common use cases
- **TypeScript support**: Full type definitions for better development experience
- **Backward compatible**: Existing `api()` method continues to work unchanged

## Getting Started

```javascript
const mondaySDK = require("monday-sdk-js");

// Initialize SDK (works with both client and server)
const monday = mondaySDK({ token: "your-api-token" });

// Use semantic API methods
const board = await monday.boards.createBoard("My Project");
const item = await monday.items.createItem(board.id, "Task 1");
const columns = await monday.columns.getColumns(board.id);
```

## Boards API

### Create Board

```javascript
// Basic board creation
const board = await monday.boards.createBoard("Project Alpha");

// Board with options
const board = await monday.boards.createBoard("Project Beta", "private", {
  description: "Internal project board",
  workspaceId: 12345,
  templateId: "template_123"
});
```

### Get Boards

```javascript
// Get a specific board
const board = await monday.boards.getBoard("123456789", {
  includeColumns: true,
  includeGroups: true
});

// Get multiple boards
const boards = await monday.boards.getBoards({
  limit: 10,
  state: "active",
  workspaceId: 12345
});
```

### Update Board

```javascript
const updatedBoard = await monday.boards.updateBoard("123456789", {
  name: "Updated Project Name",
  description: "New description"
});
```

### Other Board Operations

```javascript
// Duplicate board
const duplicatedBoard = await monday.boards.duplicateBoard("123456789", {
  boardName: "Copy of Project Alpha"
});

// Archive board
const archivedBoard = await monday.boards.deleteBoard("123456789");

// Get board activity
const activity = await monday.boards.getBoardActivity("123456789", {
  limit: 20
});
```

## Items API

### Create Items

```javascript
// Basic item creation
const item = await monday.items.createItem("123456789", "Setup Environment");

// Item with column values
const item = await monday.items.createItem(
  "123456789",
  "Design Phase",
  {
    status: { label: "Working on it" },
    priority: { label: "High" },
    date: "2024-01-15",
    text: "Create wireframes and mockups"
  },
  {
    groupId: "group_123",
    includeColumnValues: true
  }
);
```

### Get Items

```javascript
// Get specific item
const item = await monday.items.getItem("987654321", {
  includeColumnValues: true,
  includeSubitems: true
});

// Get items from board
const items = await monday.items.getItems("123456789", {
  limit: 25,
  includeColumnValues: true
});

// Get items globally
const allItems = await monday.items.getItems(null, {
  ids: ["111", "222", "333"]
});
```

### Update Items

```javascript
// Update item name
const updatedItem = await monday.items.updateItem("987654321", {
  name: "Updated Task Name"
});

// Update multiple column values
const itemWithValues = await monday.items.updateItemColumnValues("987654321", {
  status: { label: "Done" },
  priority: { label: "Low" },
  text: "Task completed successfully"
});
```

### Advanced Item Operations

```javascript
// Create subitem
const subitem = await monday.items.createSubitem("987654321", "Subtask 1", {
  status: { label: "Working on it" }
});

// Move item to another board
const movedItem = await monday.items.moveItemToBoard("987654321", "444555666", "target_group_id");

// Duplicate item
const duplicatedItem = await monday.items.duplicateItem("987654321", {
  boardId: "444555666",
  withUpdates: false
});

// Archive item
const archivedItem = await monday.items.archiveItem("987654321");

// Get item activity
const activity = await monday.items.getItemActivity("987654321");
```

## Columns API

### Get Columns

```javascript
// Get all columns for a board
const columns = await monday.columns.getColumns("123456789");

// Get columns with filtering
const columns = await monday.columns.getColumns("123456789", {
  types: ["text", "status", "date"],
  includeArchived: false
});
```

### Create Columns

```javascript
// Basic column creation
const column = await monday.columns.createColumn("123456789", {
  title: "Priority Level",
  type: "status"
});

// Column with advanced options
const column = await monday.columns.createColumn("123456789", {
  title: "Estimated Hours",
  type: "numeric",
  description: "Time estimation in hours",
  defaults: { precision: 1 }
});
```

### Update Column Values

```javascript
// Update single column value
const item = await monday.columns.changeColumnValue("987654321", "status", { label: "Done", color: "#00c875" });

// Update simple column value (text, numbers)
const item = await monday.columns.changeSimpleColumnValue("987654321", "text_column", "Updated text value");

// Clear column value
const item = await monday.columns.clearColumnValue("987654321", "status");
```

### Advanced Column Operations

```javascript
// Get column values for specific item
const columnValues = await monday.columns.getItemColumnValues("987654321", {
  columnIds: ["status", "priority", "date"]
});

// Update column properties
const updatedColumn = await monday.columns.updateColumn("status_column", {
  title: "Task Status",
  description: "Current status of the task"
});

// Get available column types
const columnTypes = await monday.columns.getColumnTypes();

// Duplicate column to another board
const duplicatedColumn = await monday.columns.duplicateColumn("source_column_id", "target_board_id", {
  title: "Copied Status Column"
});
```

## TypeScript Support

The semantic API includes comprehensive TypeScript definitions:

```typescript
import mondaySDK, { Board, Item, Column, CreateBoardOptions } from "monday-sdk-js";

const monday = mondaySDK({ token: "your-token" });

// Type-safe operations
const board: Board = await monday.boards.createBoard("Typed Board", "public");
const item: Item = await monday.items.createItem(board.id, "Typed Item");
const columns: Column[] = await monday.columns.getColumns(board.id);

// Options with intellisense
const boardOptions: CreateBoardOptions = {
  description: "A typed board",
  workspaceId: 12345,
  includeColumns: true
};
```

## Error Handling

The semantic API provides clear, actionable error messages:

```javascript
try {
  // This will throw a validation error
  await monday.boards.createBoard(); // Missing name
} catch (error) {
  console.log(error.message); // "Board name is required and must be a string"
}

try {
  // This will handle API errors
  await monday.items.getItem("non-existent-id");
} catch (error) {
  // Handle GraphQL API errors
  console.log("API Error:", error.message);
}
```

### Common Error Types

- **Validation Errors**: Parameter validation (missing required fields, wrong types)
- **API Errors**: Monday.com GraphQL API errors
- **Network Errors**: Connection and timeout issues

## Migration Guide

### From Raw GraphQL

**Before (Raw GraphQL):**

```javascript
const query = `
  mutation {
    create_board(board_name: "My Board", board_kind: public) {
      id
      name
    }
  }
`;
const response = await monday.api(query);
```

**After (Semantic API):**

```javascript
const board = await monday.boards.createBoard("My Board");
```

### From Legacy SDK Methods

The semantic API complements the existing SDK. You can use both approaches:

```javascript
// Existing API method still works
const rawResponse = await monday.api("{ boards { id name } }");

// New semantic API for common operations
const boards = await monday.boards.getBoards();
```

### Gradual Adoption

You can adopt the semantic API incrementally:

1. **Start with new code**: Use semantic API for new features
2. **Replace common patterns**: Replace frequently used GraphQL queries
3. **Keep complex queries**: Use raw GraphQL for complex, custom queries

## Field Selection

The semantic API provides sensible defaults but allows customization:

```javascript
// Default fields (id, name, basic properties)
const board = await monday.boards.getBoard("123");

// Extended fields
const board = await monday.boards.getBoard("123", {
  includeColumns: true,
  includeGroups: true
});

// Custom fields
const board = await monday.boards.getBoard("123", {
  fields: ["id", "name", "description", "created_at", "owners { id name }"]
});
```

## Best Practices

1. **Use semantic API for common operations**: Creating boards, items, updating column values
2. **Use raw GraphQL for complex queries**: Advanced filtering, custom field combinations
3. **Handle errors appropriately**: Validate inputs and handle API errors gracefully
4. **Leverage TypeScript**: Use type definitions for better development experience
5. **Consider pagination**: Use pagination options for large datasets

## Examples

Complete examples are available in:

- [`examples/semantic-api-usage.js`](./examples/semantic-api-usage.js) - Comprehensive usage examples
- [`src/api/*-test.js`](./src/api/) - Test files with detailed usage patterns

## Feedback and Contributions

The semantic API is designed to make Monday.com development more intuitive. If you have suggestions for improvements or find issues, please:

1. Check existing issues and discussions
2. Provide specific use cases and examples
3. Consider contributing improvements via pull requests

The goal is to create the most developer-friendly Monday.com SDK possible while maintaining full backward compatibility.
