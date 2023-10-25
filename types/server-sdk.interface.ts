import { APIOptions } from './client-api.interface';

export interface MondayServerSdk {
    setToken(token: string): void;

    setApiVersion(version: string): void;

    api<T = any>(query: string, options?: APIOptions): Promise<T>;

    oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;
}
