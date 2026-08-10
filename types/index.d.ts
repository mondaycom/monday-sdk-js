// Original Definitions were contributed by: Josh Parnham <https://github.com/josh->
import { MondayClientSdk } from "./client-sdk.interface";

export as namespace mondaySdk;

declare function init(
  config?: Partial<{
    clientId: string;
  }>
): MondayClientSdk;

export { MondayClientSdk };

export default init;
