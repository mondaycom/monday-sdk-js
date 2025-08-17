/**
 * TypeScript definitions for Columns API
 */

import { Column, ColumnValue, Item, QueryOptions, CreateOptions } from "./common";

export interface GetColumnsOptions extends QueryOptions {
  types?: string[];
  includeArchived?: boolean;
}

export interface CreateColumnData {
  title: string;
  type: string;
  defaults?: Record<string, any>;
  description?: string;
  id?: string;
}

export interface CreateColumnOptions extends CreateOptions {}

export interface UpdateColumnProperties {
  title?: string;
  description?: string;
  fields?: string[];
}

export interface ChangeColumnValueOptions extends CreateOptions {
  createLabelsIfMissing?: boolean;
}

export interface GetItemColumnValuesOptions {
  columnIds?: string[];
}

export interface ClearColumnValueOptions extends CreateOptions {}

export interface ColumnTypeInfo {
  name: string;
  description?: string;
}

export interface DuplicateColumnOptions extends CreateOptions {
  title?: string;
}

export declare class ColumnsAPI {
  constructor(apiClient: (query: string, options?: any) => Promise<any>);

  /**
   * Get columns for a board
   */
  getColumns(boardId: string | number, options?: GetColumnsOptions): Promise<Column[]>;

  /**
   * Create a new column
   */
  createColumn(boardId: string | number, columnData: CreateColumnData, options?: CreateColumnOptions): Promise<Column>;

  /**
   * Update column properties
   */
  updateColumn(columnId: string, updates: UpdateColumnProperties): Promise<Column | null>;

  /**
   * Delete/archive a column
   */
  deleteColumn(columnId: string): Promise<{ id: string; archived: boolean }>;

  /**
   * Update a single column value for an item
   */
  changeColumnValue(
    itemId: string | number,
    columnId: string,
    value: any,
    options?: ChangeColumnValueOptions
  ): Promise<Item>;

  /**
   * Update a simple column value for an item (text, numbers, etc.)
   */
  changeSimpleColumnValue(
    itemId: string | number,
    columnId: string,
    value: string | number,
    options?: CreateOptions
  ): Promise<Item>;

  /**
   * Get column values for a specific item
   */
  getItemColumnValues(itemId: string | number, options?: GetItemColumnValuesOptions): Promise<ColumnValue[]>;

  /**
   * Clear a column value for an item
   */
  clearColumnValue(itemId: string | number, columnId: string, options?: ClearColumnValueOptions): Promise<Item>;

  /**
   * Get all possible column types
   */
  getColumnTypes(): Promise<ColumnTypeInfo[]>;

  /**
   * Duplicate a column
   */
  duplicateColumn(columnId: string, targetBoardId: string | number, options?: DuplicateColumnOptions): Promise<Column>;
}
