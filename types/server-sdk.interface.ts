import { APIOptions } from './client-api.interface';
import { BoardsApi, ItemsApi } from '../src/boards-sdk/types';

export interface MondayServerSdk {
    setToken(token: string): void;

    setApiVersion(version: string): void;

    api<T = any>(query: string, options?: APIOptions): Promise<T>;

    oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;

    boards: BoardsApi;
    items: ItemsApi;
}
