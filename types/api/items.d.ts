/**
 * TypeScript definitions for Items API
 */

import { Item, ItemState, ColumnValue, Update, QueryOptions, CreateOptions } from "./common";

export interface CreateItemOptions extends CreateOptions {
  groupId?: string;
  createLabelsIfMissing?: boolean;
}

export interface GetItemOptions extends QueryOptions {
  includeColumnValues?: boolean;
  includeSubitems?: boolean;
}

export interface GetItemsOptions extends QueryOptions {
  ids?: (string | number)[];
  newest_first?: boolean;
  exclude_nonactive?: boolean;
  includeColumnValues?: boolean;
  includeSubitems?: boolean;
}

export interface UpdateItemProperties {
  name: string;
  fields?: string[];
}

export interface DuplicateItemOptions extends CreateOptions {
  boardId?: string | number;
  withUpdates?: boolean;
}

export interface UpdateColumnValuesOptions extends CreateOptions {
  createLabelsIfMissing?: boolean;
}

export interface CreateSubitemOptions extends CreateOptions {
  createLabelsIfMissing?: boolean;
}

export interface ItemActivityOptions extends QueryOptions {}

export declare class ItemsAPI {
  constructor(apiClient: (query: string, options?: any) => Promise<any>);

  /**
   * Create a new item
   */
  createItem(
    boardId: string | number,
    itemName: string,
    columnValues?: Record<string, any>,
    options?: CreateItemOptions
  ): Promise<Item>;

  /**
   * Get a single item by ID
   */
  getItem(itemId: string | number, options?: GetItemOptions): Promise<Item | null>;

  /**
   * Get multiple items
   */
  getItems(boardId?: string | number, options?: GetItemsOptions): Promise<Item[]>;

  /**
   * Update item properties
   */
  updateItem(itemId: string | number, updates: UpdateItemProperties): Promise<Item>;

  /**
   * Delete an item
   */
  deleteItem(itemId: string | number): Promise<{ id: string }>;

  /**
   * Duplicate an item
   */
  duplicateItem(itemId: string | number, options?: DuplicateItemOptions): Promise<Item>;

  /**
   * Move item to another board
   */
  moveItemToBoard(
    itemId: string | number,
    targetBoardId: string | number,
    groupId?: string,
    fields?: string[]
  ): Promise<Item>;

  /**
   * Update multiple column values for an item
   */
  updateItemColumnValues(
    itemId: string | number,
    columnValues: Record<string, any>,
    options?: UpdateColumnValuesOptions
  ): Promise<Item>;

  /**
   * Archive an item
   */
  archiveItem(itemId: string | number): Promise<{ id: string; state: string }>;

  /**
   * Create a subitem
   */
  createSubitem(
    parentItemId: string | number,
    itemName: string,
    columnValues?: Record<string, any>,
    options?: CreateSubitemOptions
  ): Promise<Item>;

  /**
   * Get item's activity/updates
   */
  getItemActivity(itemId: string | number, options?: ItemActivityOptions): Promise<Update[]>;
}
