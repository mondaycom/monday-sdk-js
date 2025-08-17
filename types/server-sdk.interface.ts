import { APIOptions } from "./client-api.interface";
import { IBoardsApi, IItemsApi, IColumnsApi } from "./semantic";

export interface MondayServerSdk {
  setToken(token: string): void;

  setApiVersion(version: string): void;

  api<T = any>(query: string, options?: APIOptions): Promise<T>;

  oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;

  /** Boards management API */
  readonly boards: IBoardsApi;
  /** Items management API */
  readonly items: IItemsApi;
  /** Columns management API */
  readonly columns: IColumnsApi;
}
