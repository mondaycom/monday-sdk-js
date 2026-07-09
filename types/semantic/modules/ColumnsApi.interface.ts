/**
 * TypeScript interface for monday.com SDK Columns Semantic API
 * Provides strongly-typed CRUD operations for columns
 */

import {
  SemanticApiOptions,
  FormattedColumn,
  CreateColumnInput,
  UpdateColumnInput,
  ColumnType
} from "../core/SemanticModule.interface";

/**
 * Options specific to column operations
 */
export interface ColumnApiOptions extends SemanticApiOptions {
  /** Include column settings in response */
  includeSettings?: boolean;
  /** Include archived columns */
  includeArchived?: boolean;
  /** Filter by specific column types */
  columnTypes?: ColumnType[];
}

/**
 * Options for creating a new column
 */
export interface CreateColumnOptions extends ColumnApiOptions {
  /** Default value for the column */
  defaults?: any;
  /** Column description */
  description?: string;
  /** Position to insert the column (after which column ID) */
  after_column_id?: string;
}

/**
 * Options for updating a column
 */
export interface UpdateColumnOptions extends ColumnApiOptions {
  /** Whether to archive the column instead of updating */
  archive?: boolean;
}

/**
 * Options for deleting a column
 */
export interface DeleteColumnOptions extends SemanticApiOptions {
  /** Whether to permanently delete or just archive */
  permanent?: boolean;
}

/**
 * Response type for column operations
 */
export interface ColumnResponse {
  /** The column data */
  column: FormattedColumn;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Response type for multiple columns operations
 */
export interface ColumnsResponse {
  /** Array of columns */
  columns: FormattedColumn[];
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Response type for column deletion
 */
export interface DeleteColumnResponse {
  /** Whether the deletion was successful */
  success: boolean;
  /** ID of the deleted column */
  column_id: string;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Column settings for different column types
 */
export interface StatusColumnSettings {
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  labels_positions_locked?: boolean;
  hide_footer?: boolean;
}

export interface PeopleColumnSettings {
  pusher_app_key?: string;
  pusher_cluster?: string;
}

export interface DateColumnSettings {
  hide_footer?: boolean;
}

export interface DropdownColumnSettings {
  labels: Array<{
    id: number;
    name: string;
  }>;
  hide_footer?: boolean;
}

export interface NumbersColumnSettings {
  unit?: string;
  symbol?: string;
  decimal_places?: number;
}

/**
 * Main interface for the Columns Semantic API
 * All methods return Promises for async operations
 */
export interface IColumnsApi {
  /**
   * Get all columns for a board
   * @param boardId - The ID of the board to get columns from
   * @param options - Additional options for the request
   * @returns Promise resolving to array of columns
   *
   * @example
   * ```typescript
   * const columns = await monday.columns.getColumns(123456789, {
   *   includeSettings: true,
   *   includeArchived: false
   * });
   * ```
   */
  getColumns(boardId: number, options?: ColumnApiOptions): Promise<ColumnsResponse>;

  /**
   * Create a new column in a board
   * @param boardId - ID of the board to create the column in
   * @param title - Title of the column
   * @param columnType - Type of the column
   * @param options - Additional options for column creation
   * @returns Promise resolving to the created column
   *
   * @example
   * ```typescript
   * const column = await monday.columns.createColumn(123456789, 'Priority', 'status', {
   *   description: 'Task priority level',
   *   defaults: {
   *     labels: [
   *       { name: 'High', color: '#ff0000' },
   *       { name: 'Medium', color: '#ffff00' },
   *       { name: 'Low', color: '#00ff00' }
   *     ]
   *   }
   * });
   * ```
   */
  createColumn(
    boardId: number,
    title: string,
    columnType: ColumnType,
    options?: CreateColumnOptions
  ): Promise<ColumnResponse>;

  /**
   * Update an existing column
   * @param boardId - The ID of the board containing the column
   * @param columnId - The ID of the column to update
   * @param updates - The fields to update
   * @param options - Additional options for the update
   * @returns Promise resolving to the updated column
   *
   * @example
   * ```typescript
   * const updatedColumn = await monday.columns.updateColumn(123456789, 'status', {
   *   title: 'Updated Status',
   *   description: 'New description for status column'
   * });
   * ```
   */
  updateColumn(
    boardId: number,
    columnId: string,
    updates: UpdateColumnInput,
    options?: UpdateColumnOptions
  ): Promise<ColumnResponse>;

  /**
   * Delete a column
   * @param boardId - The ID of the board containing the column
   * @param columnId - The ID of the column to delete
   * @param options - Additional options for deletion
   * @returns Promise resolving to deletion confirmation
   *
   * @example
   * ```typescript
   * const result = await monday.columns.deleteColumn(123456789, 'old_column', {
   *   permanent: false // Archive instead of permanent delete
   * });
   * ```
   */
  deleteColumn(boardId: number, columnId: string, options?: DeleteColumnOptions): Promise<DeleteColumnResponse>;
}

/**
 * Type guard to check if an object is a valid column
 */
export function isFormattedColumn(obj: any): obj is FormattedColumn {
  return obj && typeof obj.id === "string" && typeof obj.title === "string" && typeof obj.type === "string";
}

/**
 * Type guard to check if an object is a valid column response
 */
export function isColumnResponse(obj: any): obj is ColumnResponse {
  return obj && obj.column && isFormattedColumn(obj.column);
}
