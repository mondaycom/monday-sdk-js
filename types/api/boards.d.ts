/**
 * TypeScript definitions for Boards API
 */

import { Board, BoardKind, BoardState, User, Column, Group, QueryOptions, CreateOptions } from "./common";

export interface CreateBoardOptions extends CreateOptions {
  description?: string;
  folderId?: number;
  workspaceId?: number;
  templateId?: string;
}

export interface GetBoardOptions extends QueryOptions {
  includeColumns?: boolean;
  includeGroups?: boolean;
}

export interface GetBoardsOptions extends QueryOptions {
  ids?: (string | number)[];
  order_by?: string;
  state?: BoardState;
  workspaceId?: number;
  includeColumns?: boolean;
  includeGroups?: boolean;
}

export interface UpdateBoardProperties {
  name?: string;
  description?: string;
  fields?: string[];
}

export interface DuplicateBoardOptions extends CreateOptions {
  boardName?: string;
  duplicateType?:
    | "duplicate_board_with_structure"
    | "duplicate_board_with_pulses"
    | "duplicate_board_with_pulses_and_updates";
  workspaceId?: number;
  folderId?: number;
}

export interface BoardActivityOptions extends QueryOptions {}

export declare class BoardsAPI {
  constructor(apiClient: (query: string, options?: any) => Promise<any>);

  /**
   * Create a new board
   */
  createBoard(name: string, boardKind?: BoardKind, options?: CreateBoardOptions): Promise<Board>;

  /**
   * Get a single board by ID
   */
  getBoard(boardId: string | number, options?: GetBoardOptions): Promise<Board | null>;

  /**
   * Get multiple boards
   */
  getBoards(options?: GetBoardsOptions): Promise<Board[]>;

  /**
   * Update board properties
   */
  updateBoard(boardId: string | number, updates: UpdateBoardProperties): Promise<Board | null>;

  /**
   * Archive/delete a board
   */
  deleteBoard(boardId: string | number): Promise<{ id: string; state: string }>;

  /**
   * Duplicate an existing board
   */
  duplicateBoard(boardId: string | number, options?: DuplicateBoardOptions): Promise<Board>;

  /**
   * Get board activity/updates
   */
  getBoardActivity(boardId: string | number, options?: BoardActivityOptions): Promise<any[]>;
}
