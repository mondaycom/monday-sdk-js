import { APIOptions } from './client-api.interface';

export interface MondayServerSdk {
    setToken(token: string): void;

    setApiVersion(version: string): void;

    api(query: string, options?: APIOptions): Promise<any>;

    oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;
}
