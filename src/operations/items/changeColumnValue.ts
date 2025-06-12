import { OperationsError } from '../errors';
import { ApiFunction } from '../operationsClient';

export interface ChangeColumnValueResponse {
  id: number;
}

export type ColumnValue = string | Record<string, unknown>;

export async function changeColumnValue(
  api: ApiFunction,
  itemId: number,
  columnId: string,
  value: ColumnValue
): Promise<ChangeColumnValueResponse> {
  const query = `
    mutation ($itemId: Int!, $columnId: String!, $value: JSON!) {
      change_column_value(item_id: $itemId, column_id: $columnId, value: $value) {
        id
      }
    }
  `;

  const variables = {
    itemId,
    columnId,
    value: typeof value === 'object' ? JSON.stringify(value) : value,
  };

  try {
    const result = await api<{ change_column_value: { id: number } }>(query, { variables });
    return { id: result.change_column_value.id };
  } catch (err) {
    throw new OperationsError((err as Error).message);
  }
}
