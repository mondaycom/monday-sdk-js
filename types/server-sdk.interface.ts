import { APIOptions } from "./client-api.interface";
import { SemanticAPI } from "./api";

export interface MondayServerSdk extends SemanticAPI {
  setToken(token: string): void;

  setApiVersion(version: string): void;

  api<T = any>(query: string, options?: APIOptions): Promise<T>;

  oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;
}
