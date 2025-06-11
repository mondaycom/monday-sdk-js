import { OperationsError } from '../errors';
import { ApiFunction } from '../operationsClient';

export interface Board {
  id: number;
  name: string;
}

export interface GetBoardsOptions {
  ids?: number[];
}

export interface GetBoardsResponse {
  boards: Board[];
}

export async function getBoards(
  api: ApiFunction,
  options: GetBoardsOptions = {}
): Promise<GetBoardsResponse> {
  const query = `
    query ($ids: [Int]) {
      boards(ids: $ids) {
        id
        name
      }
    }
  `;

  try {
    const result = await api<{ boards: Board[] }>(query, { variables: { ids: options.ids } });
    return { boards: result.boards };
  } catch (err) {
    throw new OperationsError((err as Error).message);
  }
}
