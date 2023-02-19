// Original Definitions were contributed by: Josh Parnham <https://github.com/josh->
import { ClientData } from './client-data.interface';
import { ClientExecute } from './client-execute.interface';
import { ClientApi } from './client-api.interface';

export as namespace mondaySdk;

type MondayClientSdk = ClientData & ClientExecute & ClientApi;

interface MondayServerSdk {
    setToken(token: string): void;

    api(query: string, options?: Partial<{ token: string, variables: object } >): Promise<any>;

    oauthToken(code: string, clientId: string, clientSecret: string): Promise<any>;
}

declare function init(
    config?: Partial<{
        clientId: string;
        apiToken: string;
    }>,
): MondayClientSdk;

declare function init(
    config?: Partial<{
        token: string;
    }>,
): MondayServerSdk;

export = init;
