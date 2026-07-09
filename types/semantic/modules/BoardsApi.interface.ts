/**
 * TypeScript interface for monday.com SDK Boards Semantic API
 * Provides strongly-typed CRUD operations for boards
 */

import {
  SemanticApiOptions,
  FormattedBoard,
  CreateBoardInput,
  UpdateBoardInput,
  BoardKind
} from "../core/SemanticModule.interface";

/**
 * Options specific to board operations
 */
export interface BoardApiOptions extends SemanticApiOptions {
  /** Include columns in board response */
  includeColumns?: boolean;
  /** Include items in board response */
  includeItems?: boolean;
  /** Include board permissions */
  includePermissions?: boolean;
  /** Include workspace information */
  includeWorkspace?: boolean;
  /** Limit number of items returned (for getBoards) */
  limit?: number;
  /** Page number for pagination (for getBoards) */
  page?: number;
  /** Filter boards by state */
  state?: "active" | "archived" | "deleted" | "all";
  /** Filter boards by workspace */
  workspace_ids?: number[];
}

/**
 * Options for creating a new board
 */
export interface CreateBoardOptions extends BoardApiOptions {
  /** Template to use when creating the board */
  template_id?: number;
  /** Workspace to create the board in */
  workspace_id?: number;
  /** Folder to create the board in */
  folder_id?: number;
  /** Whether to create default groups */
  empty?: boolean;
}

/**
 * Options for updating a board
 */
export interface UpdateBoardOptions extends BoardApiOptions {
  /** Whether to move the board to a different workspace */
  workspace_id?: number;
}

/**
 * Options for deleting a board
 */
export interface DeleteBoardOptions extends SemanticApiOptions {
  /** Whether to permanently delete or just archive */
  permanent?: boolean;
}

/**
 * Response type for board operations
 */
export interface BoardResponse {
  /** The board data */
  board: FormattedBoard;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Response type for multiple boards operations
 */
export interface BoardsResponse {
  /** Array of boards */
  boards: FormattedBoard[];
  /** Total count of boards (if pagination is used) */
  total_count?: number;
  /** Current page number (if pagination is used) */
  page?: number;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Response type for board deletion
 */
export interface DeleteBoardResponse {
  /** Whether the deletion was successful */
  success: boolean;
  /** ID of the deleted board */
  board_id: number;
  /** Any warnings or additional information */
  warnings?: string[];
}

/**
 * Main interface for the Boards Semantic API
 * All methods return Promises for async operations
 */
export interface IBoardsApi {
  /**
   * Create a new board
   * @param name - Name of the board
   * @param kind - Board visibility/permission type
   * @param options - Additional options for board creation
   * @returns Promise resolving to the created board
   *
   * @example
   * ```typescript
   * const board = await monday.boards.createBoard('My New Board', 'public', {
   *   description: 'A board for tracking tasks',
   *   template_id: 123,
   *   includeColumns: true
   * });
   * ```
   */
  createBoard(name: string, kind?: BoardKind, options?: CreateBoardOptions): Promise<BoardResponse>;

  /**
   * Get a specific board by ID
   * @param boardId - The ID of the board to retrieve
   * @param options - Additional options for the request
   * @returns Promise resolving to the board data
   *
   * @example
   * ```typescript
   * const board = await monday.boards.getBoard(123456789, {
   *   includeItems: true,
   *   includeColumns: true
   * });
   * ```
   */
  getBoard(boardId: number, options?: BoardApiOptions): Promise<BoardResponse>;

  /**
   * Get multiple boards
   * @param options - Options for filtering and pagination
   * @returns Promise resolving to array of boards
   *
   * @example
   * ```typescript
   * const boards = await monday.boards.getBoards({
   *   limit: 10,
   *   state: 'active',
   *   workspace_ids: [12345]
   * });
   * ```
   */
  getBoards(options?: BoardApiOptions): Promise<BoardsResponse>;

  /**
   * Update an existing board
   * @param boardId - The ID of the board to update
   * @param updates - The fields to update
   * @param options - Additional options for the update
   * @returns Promise resolving to the updated board
   *
   * @example
   * ```typescript
   * const updatedBoard = await monday.boards.updateBoard(123456789, {
   *   name: 'Updated Board Name',
   *   description: 'New description'
   * });
   * ```
   */
  updateBoard(boardId: number, updates: UpdateBoardInput, options?: UpdateBoardOptions): Promise<BoardResponse>;

  /**
   * Delete a board
   * @param boardId - The ID of the board to delete
   * @param options - Additional options for deletion
   * @returns Promise resolving to deletion confirmation
   *
   * @example
   * ```typescript
   * const result = await monday.boards.deleteBoard(123456789, {
   *   permanent: false // Archive instead of permanent delete
   * });
   * ```
   */
  deleteBoard(boardId: number, options?: DeleteBoardOptions): Promise<DeleteBoardResponse>;
}

/**
 * Type guard to check if an object is a valid board
 */
export function isFormattedBoard(obj: any): obj is FormattedBoard {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    ["public", "private", "shareable"].includes(obj.kind)
  );
}

/**
 * Type guard to check if an object is a valid board response
 */
export function isBoardResponse(obj: any): obj is BoardResponse {
  return obj && obj.board && isFormattedBoard(obj.board);
}
