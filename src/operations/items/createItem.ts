import { OperationsError } from '../errors';
import { ApiFunction } from '../operationsClient';

export interface CreateItemResponse {
  id: number;
}

export type ColumnValues = string | Record<string, unknown>;

export async function createItem(
  api: ApiFunction,
  boardId: number,
  groupId: string | undefined,
  itemName: string,
  columnValues?: ColumnValues
): Promise<CreateItemResponse> {
  const query = `
    mutation ($boardId: Int!, $groupId: String, $itemName: String!, $columnValues: JSON) {
      create_item(board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) {
        id
      }
    }
  `;

  const variables = {
    boardId,
    groupId,
    itemName,
    columnValues: typeof columnValues === 'object' ? JSON.stringify(columnValues) : columnValues,
  };

  try {
    const result = await api<{ create_item: { id: number } }>(query, { variables });
    return { id: result.create_item.id };
  } catch (err) {
    throw new OperationsError((err as Error).message);
  }
}
