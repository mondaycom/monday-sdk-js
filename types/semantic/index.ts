/**
 * Main export file for monday.com SDK Semantic API TypeScript definitions
 * Provides comprehensive type definitions for the semantic layer
 */

// Core interfaces and types
export * from './core/SemanticModule.interface';

// Module-specific interfaces
export * from './modules/BoardsApi.interface';
export * from './modules/ItemsApi.interface';
export * from './modules/ColumnsApi.interface';

// Re-export commonly used types for convenience
export type {
  ISemanticModule,
  IModuleRegistry,
  SemanticApiOptions,
  FormattedBoard,
  FormattedItem,
  FormattedColumn,
  FormattedColumnValue,
  BoardKind,
  ColumnType,
  CreateBoardInput,
  UpdateBoardInput,
  CreateItemInput,
  UpdateItemInput,
  CreateColumnInput,
  UpdateColumnInput
} from './core/SemanticModule.interface';

export type { IBoardsApi } from './modules/BoardsApi.interface';
export type { IItemsApi } from './modules/ItemsApi.interface';
export type { IColumnsApi } from './modules/ColumnsApi.interface';

// Import for use in interfaces defined in this file
import type { IBoardsApi } from './modules/BoardsApi.interface';
import type { IItemsApi } from './modules/ItemsApi.interface';
import type { IColumnsApi } from './modules/ColumnsApi.interface';
import type { IModuleRegistry } from './core/SemanticModule.interface';

/**
 * Combined interface representing the full Semantic API
 * This is what gets attached to the main SDK instances
 */
export interface ISemanticAPI {
  /** Boards management API */
  readonly boards: IBoardsApi;
  /** Items management API */
  readonly items: IItemsApi;
  /** Columns management API */
  readonly columns: IColumnsApi;
}

/**
 * Configuration options for initializing the semantic API
 */
export interface SemanticAPIConfig {
  /** Whether to enable debug logging */
  debug?: boolean;
  /** Default timeout for all API requests (in milliseconds) */
  defaultTimeout?: number;
  /** Whether to return raw responses by default */
  defaultRawResponse?: boolean;
  /** Whether to return raw errors by default */
  defaultRawErrors?: boolean;
  /** Custom module registry to use */
  moduleRegistry?: IModuleRegistry;
}

/**
 * Type guards and utility functions
 */
export { 
  isFormattedBoard, 
  isBoardResponse 
} from './modules/BoardsApi.interface';

export { 
  isFormattedItem, 
  isItemResponse 
} from './modules/ItemsApi.interface';

export { 
  isFormattedColumn, 
  isColumnResponse 
} from './modules/ColumnsApi.interface';

/**
 * Helper type for extracting API method return types
 */
export type ApiMethodReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

/**
 * Helper type for extracting API method parameter types
 */
export type ApiMethodParams<T> = T extends (...args: infer P) => any ? P : never;

/**
 * Utility type for making all properties of an interface optional
 * Useful for partial updates
 */
export type PartialUpdate<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Utility type for making specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Version information for the semantic API
 */
export const SEMANTIC_API_VERSION = '1.0.0';

/**
 * Supported API features for feature detection
 */
export const SUPPORTED_FEATURES = {
  boards: {
    create: true,
    read: true,
    update: true,
    delete: true,
    pagination: true,
    filtering: true
  },
  items: {
    create: true,
    read: true,
    update: true,
    delete: true,
    columnValues: true,
    pagination: true,
    filtering: true
  },
  columns: {
    create: true,
    read: true,
    update: true,
    delete: true,
    settings: true,
    typeValidation: true
  },
  general: {
    errorHandling: true,
    responseTransformation: true,
    autoDiscovery: true,
    lazyLoading: true,
    typeScript: true
  }
} as const;

/**
 * Type for accessing feature flags
 */
export type SupportedFeatures = typeof SUPPORTED_FEATURES;
