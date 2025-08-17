/**
 * TypeScript definitions for Monday.com Semantic API Layer
 */

import { BoardsAPI } from "./boards";
import { ItemsAPI } from "./items";
import { ColumnsAPI } from "./columns";

export * from "./common";
export * from "./boards";
export * from "./items";
export * from "./columns";

export interface SemanticAPI {
  /**
   * Boards API for board management operations
   */
  boards: BoardsAPI;

  /**
   * Items API for item management operations
   */
  items: ItemsAPI;

  /**
   * Columns API for column management operations
   */
  columns: ColumnsAPI;
}

export interface SDKInstance {
  api(query: string, options?: any): Promise<any>;
}

/**
 * Create semantic API instances bound to a specific SDK instance
 */
export declare function createSemanticAPI(sdkInstance: SDKInstance): SemanticAPI;

export { BoardsAPI, ItemsAPI, ColumnsAPI };
