import { APIOptions } from './client-api.interface';

export interface MondayServerSdk {
    setToken(token: string): void;

    setApiVersion(version: string): void;

    /**
     * @deprecated The 'api' method is deprecated and will be removed in a future version.
     * Please migrate to the official monday.com API package: https://www.npmjs.com/package/@mondaydotcomorg/api
     * For more information, visit: https://developer.monday.com/api-reference/docs/api-sdk
     */
    api<T = any>(query: string, options?: APIOptions): Promise<T>;

    oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;
}
