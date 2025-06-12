import { OperationsError } from '../errors';
import { ApiFunction } from '../operationsClient';

export interface Item {
  id: number;
  name: string;
}

export interface ItemsQuery {
  columnId: string;
  columnValue: string | number;
  limit?: number;
  page?: number;
}

export interface GetItemsByQueryOptions {
  fields?: string[];
}

export interface GetItemsByQueryResponse {
  items: Item[];
}

export async function getItemsByQuery(
  api: ApiFunction,
  boardId: number,
  queryInput: ItemsQuery,
  options: GetItemsByQueryOptions = {}
): Promise<GetItemsByQueryResponse> {
  const fields = options.fields?.join(' ') || 'id name';
  const query = `
    query ($boardId: Int!, $columnId: String!, $columnValue: String!, $limit: Int, $page: Int) {
      items_page_by_column_values(board_id: $boardId, column_id: $columnId, column_value: $columnValue, limit: $limit, page: $page) {
        ${fields}
      }
    }
  `;

  const variables = {
    boardId,
    columnId: queryInput.columnId,
    columnValue: String(queryInput.columnValue),
    limit: queryInput.limit,
    page: queryInput.page,
  };

  try {
    const result = await api<{ items_page_by_column_values: Item[] }>(query, { variables });
    return { items: result.items_page_by_column_values };
  } catch (err) {
    throw new OperationsError((err as Error).message);
  }
}
