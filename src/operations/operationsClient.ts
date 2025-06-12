import { getBoards } from './boards/getBoards';
import { getItemsByQuery } from './items/getItemsByQuery';
import { createItem } from './items/createItem';
import { changeColumnValue } from './items/changeColumnValue';

export interface ApiFunction {
  <T = any>(query: string, options?: { variables?: object }): Promise<T>;
}

export { getBoards, getItemsByQuery, createItem, changeColumnValue };

export interface OperationsClient {
  getBoards: typeof getBoards;
  getItemsByQuery: typeof getItemsByQuery;
  createItem: typeof createItem;
  changeColumnValue: typeof changeColumnValue;
}

export function createOperationsClient(api: ApiFunction): OperationsClient {
  return {
    getBoards: (options) => getBoards(api, options),
    getItemsByQuery: (boardId, query, options) => getItemsByQuery(api, boardId, query, options),
    createItem: (boardId, groupId, itemName, columnValues) => createItem(api, boardId, groupId, itemName, columnValues),
    changeColumnValue: (itemId, columnId, value) => changeColumnValue(api, itemId, columnId, value),
  };
}
