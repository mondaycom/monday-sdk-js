/**
 * Common types for Monday.com API
 */

export interface APIOptions {
  /**
   * Access token for the API
   */
  token?: string;

  /**
   * GraphQL query variables
   */
  variables?: Record<string, any>;

  /**
   * API version to use
   */
  apiVersion?: string;
}

export interface BaseObject {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Creator extends User {}

export interface ColumnValue {
  id: string;
  type: string;
  title: string;
  text?: string;
  value?: string | null;
  additional_info?: string;
}

export interface Update {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  creator: Creator;
}

export interface Group {
  id: string;
  title: string;
  color?: string;
  position?: string;
  archived?: boolean;
}

export interface Column {
  id: string;
  title: string;
  type: string;
  description?: string;
  settings_str?: string;
  archived?: boolean;
  width?: number;
  pos?: string;
  board?: {
    id: string;
    name: string;
  };
}

export interface Board extends BaseObject {
  name: string;
  description?: string;
  state?: string;
  board_kind?: string;
  board_folder_id?: string;
  workspace_id?: string;
  owners?: User[];
  columns?: Column[];
  groups?: Group[];
  updates?: Update[];
}

export interface Item extends BaseObject {
  name: string;
  state?: string;
  creator_id?: string;
  board?: {
    id: string;
    name: string;
  };
  group?: {
    id: string;
    title: string;
  };
  column_values?: ColumnValue[];
  subitems?: Item[];
  updates?: Update[];
}

export type BoardKind = "public" | "private" | "share";
export type BoardState = "active" | "archived" | "deleted";
export type ItemState = "active" | "archived" | "deleted";
export type DuplicateBoardType =
  | "duplicate_board_with_structure"
  | "duplicate_board_with_pulses"
  | "duplicate_board_with_pulses_and_updates";

export interface QueryOptions {
  limit?: number;
  page?: number;
  fields?: string[];
}

export interface CreateOptions {
  fields?: string[];
}
