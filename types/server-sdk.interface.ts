import { APIOptions } from './client-api.interface';

/**
 * @deprecated The monday-sdk-js server SDK is deprecated and will be removed in version 1.0.0.
 * The api() method for GraphQL queries should be replaced with @mondaydotcomorg/api: https://www.npmjs.com/package/@mondaydotcomorg/api
 * For more information, visit: https://developer.monday.com/api-reference/docs/api-sdk
 */
export interface MondayServerSdk {
    setToken(token: string): void;

    setApiVersion(version: string): void;

    api<T = any>(query: string, options?: APIOptions): Promise<T>;

    oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;
}
