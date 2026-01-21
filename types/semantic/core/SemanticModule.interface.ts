/**
 * Core TypeScript interfaces for monday.com SDK Semantic API Layer
 * Defines the base structure for semantic modules and their APIs
 */

/**
 * Options that can be passed to any semantic API method
 */
export interface SemanticApiOptions {
  /** Return raw GraphQL response instead of normalized data */
  rawResponse?: boolean;
  /** Return raw GraphQL errors instead of semantic errors */
  rawErrors?: boolean;
  /** Additional fields to include in GraphQL queries */
  additionalFields?: string[];
  /** Timeout for the API request in milliseconds */
  timeout?: number;
}

/**
 * Base interface for all semantic module implementations
 */
export interface ISemanticModule {
  /** Module name (e.g., 'boards', 'items', 'columns') */
  readonly name: string;
  /** Module version */
  readonly version: string;
  /** Other modules this module depends on */
  readonly dependencies: string[];
}

/**
 * Constructor interface for semantic modules
 */
export interface SemanticModuleConstructor {
  new (sdk: any, isClientSdk: boolean): ISemanticModule;
  readonly name: string;
  readonly version: string;
  readonly dependencies: string[];
}

/**
 * Module registry interface for auto-discovery system
 */
export interface IModuleRegistry {
  /** Register a new semantic module */
  register(moduleClass: SemanticModuleConstructor): void;

  /** Get a specific module instance */
  get(name: string, sdkInstance: any, isClientSdk?: boolean): ISemanticModule | null;

  /** Get all registered module names */
  getAll(): string[];

  /** Check if a module is registered */
  has(name: string): boolean;
}

/**
 * Response transformer interface
 */
export interface IResponseTransformer {
  /** Parse GraphQL response and extract data */
  parseGraphQLResponse<T>(response: any, dataKey?: string, options?: SemanticApiOptions): T;

  /** Format board data */
  formatBoardData(boardData: any): FormattedBoard;

  /** Format item data */
  formatItemData(itemData: any): FormattedItem;

  /** Format column data */
  formatColumnData(columnData: any): FormattedColumn;
}

/**
 * Error handling interface
 */
export interface ISemanticError extends Error {
  /** Original GraphQL error if available */
  readonly originalError: Error | null;
  /** Operation that failed */
  readonly operation: string;
  /** Additional context about the error */
  readonly context: Record<string, any>;
}

/**
 * Common data types used across semantic API
 */

/** Board visibility/permission types */
export type BoardKind = "public" | "private" | "shareable";

/** Column value types supported by monday.com */
export type ColumnType =
  | "text"
  | "numbers"
  | "status"
  | "date"
  | "people"
  | "timeline"
  | "email"
  | "phone"
  | "link"
  | "rating"
  | "checkbox"
  | "location"
  | "file"
  | "tags"
  | "dropdown"
  | "long_text"
  | "auto_number"
  | "creation_log"
  | "last_updated";

/**
 * Formatted data structures returned by semantic API
 */

export interface FormattedBoard {
  id: number;
  name: string;
  description?: string;
  kind: BoardKind;
  state: "active" | "archived" | "deleted";
  permalink?: string;
  created_at?: string;
  updated_at?: string;
  creator?: {
    id: number;
    name: string;
    email?: string;
  };
  owners?: Array<{
    id: number;
    name: string;
    email?: string;
  }>;
  permissions?: string;
  workspace?: {
    id: number;
    name: string;
  };
  columns?: FormattedColumn[];
  items?: FormattedItem[];
}

export interface FormattedItem {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  state?: "active" | "archived" | "deleted";
  creator?: {
    id: number;
    name: string;
    email?: string;
  };
  board?: {
    id: number;
    name: string;
  };
  group?: {
    id: string;
    title: string;
  };
  column_values?: Array<FormattedColumnValue>;
  subscribers?: Array<{
    id: number;
    name: string;
    email?: string;
  }>;
}

export interface FormattedColumn {
  id: string;
  title: string;
  type: ColumnType;
  description?: string;
  settings_str?: string;
  width?: number;
  archived?: boolean;
}

export interface FormattedColumnValue {
  id: string;
  column?: FormattedColumn;
  value?: any;
  text?: string;
  additional_info?: any;
}

/**
 * Input types for creating/updating data
 */

export interface CreateBoardInput {
  name: string;
  kind?: BoardKind;
  description?: string;
  template_id?: number;
  workspace_id?: number;
  folder_id?: number;
}

export interface UpdateBoardInput {
  name?: string;
  description?: string;
  communication?: any;
  workspace_id?: number;
}

export interface CreateItemInput {
  name: string;
  group_id?: string;
  column_values?: Record<string, any>;
  create_labels_if_missing?: boolean;
}

export interface UpdateItemInput {
  name?: string;
  column_values?: Record<string, any>;
  create_labels_if_missing?: boolean;
}

export interface CreateColumnInput {
  title: string;
  column_type: ColumnType;
  description?: string;
  defaults?: any;
}

export interface UpdateColumnInput {
  title?: string;
  description?: string;
}
