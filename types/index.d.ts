// Original Definitions were contributed by: Josh Parnham <https://github.com/josh->
import { MondayClientSdk } from './client-sdk.interface';
import { MondayServerSdk } from './server-sdk.interface';

export as namespace mondaySdk;

declare function init(
    config?: Partial<{
        clientId: string;
        apiToken: string;
        apiVersion: string;
    }>,
): MondayClientSdk;

declare function init(
    config?: Partial<{
        token: string;
        apiVersion: string;
    }>,
): MondayServerSdk;

export = init;
