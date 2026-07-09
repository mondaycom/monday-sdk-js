import { ClientData } from "./client-data.interface";
import { ClientExecute } from "./client-execute.interface";
import { ClientApi } from "./client-api.interface";
import { IBoardsApi, IItemsApi, IColumnsApi } from "./semantic";

export interface SemanticApiExtension {
  /** Boards management API */
  readonly boards: IBoardsApi;
  /** Items management API */
  readonly items: IItemsApi;
  /** Columns management API */
  readonly columns: IColumnsApi;
}

export type MondayClientSdk = ClientData & ClientExecute & ClientApi & SemanticApiExtension;
