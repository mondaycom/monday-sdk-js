/**
 * TypeScript interface for monday.com SDK Items Semantic API
 * Provides strongly-typed CRUD operations for items
 */

import { SemanticApiOptions, FormattedItem, CreateItemInput, UpdateItemInput } from "../core/SemanticModule.interface";

/**
 * Options specific to item operations
 */
export interface ItemApiOptions extends SemanticApiOptions {
  /** Include column values in item response */
  includeColumnValues?: boolean;
  /** Include board information */
  includeBoard?: boolean;
  /** Include group information */
  includeGroup?: boolean;
  /** Include creator information */
  includeCreator?: boolean;
  /** Include subscribers */
  includeSubscribers?: boolean;
  /** Limit number of items returned */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Filter items by state */
  state?: "active" | "archived" | "deleted" | "all";
  /** Filter by specific column values */
  columnValues?: Record<string, any>;
}

/**
 * Options for creating a new item
 */
export interface CreateItemOptions extends ItemApiOptions {
  /** Group to create the item in */
  group_id?: string;
  /** Whether to create labels if they don't exist */
  create_labels_if_missing?: boolean;
}

/**
 * Options for updating item column values
 */
export interface UpdateItemColumnValuesOptions extends ItemApiOptions {
  /** Whether to create labels if they don't exist */
  create_labels_if_missing?: boolean;
}

/**
 * Options for deleting an item
 */
export interface DeleteItemOptions extends SemanticApiOptions {
  /** Whether to permanently delete or just archive */
  permanent?: boolean;
}

/**
 * Response type for item operations
 */
export interface ItemResponse {
  /** The item data */
  item: FormattedItem;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Response type for multiple items operations
 */
export interface ItemsResponse {
  /** Array of items */
  items: FormattedItem[];
  /** Total count of items (if pagination is used) */
  total_count?: number;
  /** Current page number (if pagination is used) */
  page?: number;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Response type for item deletion
 */
export interface DeleteItemResponse {
  /** Whether the deletion was successful */
  success: boolean;
  /** ID of the deleted item */
  item_id: number;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Main interface for the Items Semantic API
 * All methods return Promises for async operations
 */
export interface IItemsApi {
  /**
   * Create a new item
   * @param boardId - ID of the board to create the item in
   * @param name - Name of the item
   * @param options - Additional options for item creation
   * @returns Promise resolving to the created item
   *
   * @example
   * ```typescript
   * const item = await monday.items.createItem(123456789, 'New Task', {
   *   group_id: 'topics',
   *   column_values: {
   *     status: 'Working on it',
   *     date: '2025-01-30'
   *   }
   * });
   * ```
   */
  createItem(boardId: number, name: string, options?: CreateItemOptions): Promise<ItemResponse>;

  /**
   * Get a specific item by ID
   * @param itemId - The ID of the item to retrieve
   * @param options - Additional options for the request
   * @returns Promise resolving to the item data
   *
   * @example
   * ```typescript
   * const item = await monday.items.getItem(987654321, {
   *   includeColumnValues: true,
   *   includeBoard: true
   * });
   * ```
   */
  getItem(itemId: number, options?: ItemApiOptions): Promise<ItemResponse>;

  /**
   * Get multiple items from a board
   * @param boardId - The ID of the board to get items from
   * @param options - Options for filtering and pagination
   * @returns Promise resolving to array of items
   *
   * @example
   * ```typescript
   * const items = await monday.items.getItems(123456789, {
   *   limit: 20,
   *   state: 'active',
   *   includeColumnValues: true
   * });
   * ```
   */
  getItems(boardId: number, options?: ItemApiOptions): Promise<ItemsResponse>;

  /**
   * Update column values for an item
   * @param itemId - The ID of the item to update
   * @param columnValues - The column values to update
   * @param options - Additional options for the update
   * @returns Promise resolving to the updated item
   *
   * @example
   * ```typescript
   * const updatedItem = await monday.items.updateItemColumnValues(987654321, {
   *   status: 'Done',
   *   text: 'Task completed successfully',
   *   date: '2025-01-30'
   * });
   * ```
   */
  updateItemColumnValues(
    itemId: number,
    columnValues: Record<string, any>,
    options?: UpdateItemColumnValuesOptions
  ): Promise<ItemResponse>;

  /**
   * Delete an item
   * @param itemId - The ID of the item to delete
   * @param options - Additional options for deletion
   * @returns Promise resolving to deletion confirmation
   *
   * @example
   * ```typescript
   * const result = await monday.items.deleteItem(987654321, {
   *   permanent: false // Archive instead of permanent delete
   * });
   * ```
   */
  deleteItem(itemId: number, options?: DeleteItemOptions): Promise<DeleteItemResponse>;
}

/**
 * Type guard to check if an object is a valid item
 */
export function isFormattedItem(obj: any): obj is FormattedItem {
  return obj && typeof obj.id === "number" && typeof obj.name === "string";
}

/**
 * Type guard to check if an object is a valid item response
 */
export function isItemResponse(obj: any): obj is ItemResponse {
  return obj && obj.item && isFormattedItem(obj.item);
}
