import { ClientData } from './client-data.interface';
import { ClientExecute } from './client-execute.interface';
import { ClientApi } from './client-api.interface';
import { BoardsApi, ItemsApi } from '../src/boards-sdk/types';

export type MondayClientSdk = ClientData & ClientExecute & ClientApi & {
  boards: BoardsApi;
  items: ItemsApi;
};
