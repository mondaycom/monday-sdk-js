/** Board visibility */
export type BoardKind = "public" | "private" | "share";

/** Filter operator applied between rules */
export type ItemsQueryOperator = "and" | "or";

/** Rule-level operator (API doc: any_of, between, contains_text, …) */
export type ItemsQueryRuleOperator =
  | "any_of"
  | "not_any_of"
  | "between"
  | "eq"
  | "neq"
  | "is_empty"
  | "is_not_empty"
  | "contains_text"
  | "not_contains_text";

/** One rule inside query_params.rules */
export interface ItemsQueryRule {
  columnId: string;
  compareValue?: (string | number | null)[];
  compareAttribute?: string;
  operator?: ItemsQueryRuleOperator;
}

/** Full query_params object (see https://developer.monday.com/api-reference/reference/items-page) */
export interface ItemsQuery {
  rules: ItemsQueryRule[];
  operator?: ItemsQueryOperator;
  orderBy?: { columnId: string; direction?: "asc" | "desc" }[];
}

/** Pagination wrapper used by listBoardItems */
export interface Paginated<T> {
  items: T[];
  pageInfo: { limit: number; cursor: string | null; hasNextPage: boolean };
}

export interface ColumnValues {
  [columnId: string]: unknown;
}

export interface Board {
  id: number;
  [key: string]: unknown;
}

export interface Item {
  id: number;
  [key: string]: unknown;
}

export interface BoardsApi {
  createBoard(args: { name: string; kind?: BoardKind }, apiVersion?: string): Promise<Board>;
  getBoard(args: { boardId: number }, apiVersion?: string): Promise<Board>;
  archiveBoard(args: { boardId: number }, apiVersion?: string): Promise<{ id: number; state: string }>;
}

export interface ItemsApi {
  createItem(
    args: { boardId: number; name: string; columnValues?: ColumnValues },
    apiVersion?: string
  ): Promise<Item>;
  getItem(args: { itemId: number }, apiVersion?: string): Promise<Item>;
  archiveItem(args: { itemId: number }, apiVersion?: string): Promise<{ id: number; state: string }>;
  listBoardItems(
    args: { boardId: number; limit?: number; cursor?: string; queryParams?: ItemsQuery },
    apiVersion?: string
  ): Promise<Paginated<Item>>;
}
