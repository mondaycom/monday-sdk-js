import { AppFeatureContextMap, AppFeatureTypes } from "./client-context.type";

export type LocationResponse = Record<string, any> & {
  href: string;
  search: string;
};

export type FilterResponse = Record<string, any> & {
  term: string;
  rules: (Record<string, any> & {
    column_id?: string;
    compare_value?: string[];
    compare_attribute?: string;
    operator?: string;
  })[];
  operator: string | null;
};

type SubscribableEventsResponse<AppFeatureType extends AppFeatureTypes = AppFeatureTypes> = {
  context: AppFeatureContextMap[AppFeatureType];
  settings: Record<string, any>;
  itemIds: number[];
  events: Record<string, any>;
  location: LocationResponse;
  filter: FilterResponse;
};

type SubscribableEvents = keyof SubscribableEventsResponse;

type SettableTypes = "settings";

type StorageResponse = {
  success: boolean;
  value: any;
  version?: any;
};

type Response<T = StorageResponse> = {
  data: T;
  errorMessage?: string | undefined;
  method: string;
  requestId: string;
  type?: string | undefined;
};

type DeleteResponse = {
  data: {
    success: boolean;
    value: any;
  };
  errorMessage?: string | undefined;
  method: string;
  requestId: string;
  type?: string | undefined;
};

interface SetResponse {
  data: {
    success: boolean;
    version: string;
    reason?: string | undefined;
    error?: string | undefined;
  };
  errorMessage?: string | undefined;
  requestId: string;
  method: string;
  type?: string | undefined;
}

export type GetterResponse<AppFeatureType extends AppFeatureTypes = AppFeatureTypes> = {
  context: AppFeatureContextMap[AppFeatureType];
  settings: Record<string, any>;
  itemIds: number[];
  sessionToken: string;
  location: LocationResponse;
  filter: FilterResponse;
};
export interface ClientData {
  /**
   * Used for retrieving data from the parent monday.com application where your app is currently running.
   * This object can only be used when your app is running inside an `iframe`. This can only be used in client-side apps.
   * @param type The type of requested information (available values below)
   * - `'context'` Information about where this app is currently displayed, depending on the type of feature
   * - `'settings'` The application settings as configured by the user that installed the app
   * - `'itemIds'` The list of item IDs that are filtered in the current board (or all items if no filters are applied)
   * - `'sessionToken'` A JWT token which is decoded with your app's secret and can be used as a session token between your app's frontend & backend
   * @param params Reserved for future use
   */
  get<
    CustomResponse,
    T extends keyof GetterResponse = keyof GetterResponse,
    AppFeatureType extends AppFeatureTypes = AppFeatureTypes
  >(
    type: T | string,
    params?: Record<string, any> & { appFeatureType?: AppFeatureType }
  ): Promise<Response<GetterResponse<AppFeatureType>[T] & CustomResponse>>;

  /**
   * Creates a listener which allows subscribing to certain types of client-side events.
   * @param typeOrTypes The type, or array of types, of events to subscribe to
   * @param callback A callback function that is fired when the listener is triggered by a client-side event
   * @param params Reserved for future use
   * @return Unsubscribe/unlisten from all added during this method call
   */
  listen<
    CustomResponse,
    T extends SubscribableEvents = SubscribableEvents,
    AppFeatureType extends AppFeatureTypes = AppFeatureTypes
  >(
    typeOrTypes: (T | string) | ReadonlyArray<T | string>,
    callback: (res: { data: SubscribableEventsResponse<AppFeatureType>[T] & CustomResponse }) => void,
    params?: Record<string, any> & { appFeatureType?: AppFeatureType }
  ): () => void;

  /**
   * Set data in your application, such as updating settings
   * @param type The type of data that can be set
   * @param params object containing the data you want to update
   */
  set(type: SettableTypes, params: object): Promise<any>;

  /**
   * The Storage API is in early beta stages, its API is likely to change
   *
   * The monday apps infrastructure includes a persistent, key-value database storage that developers
   * can leverage to store data without having to create their own backend and maintain their own database.
   *
   * The database currently offers instance-level storage only, meaning that each application instance (i.e. a single board view or a dashboard widget) maintains its own storage.
   * Apps cannot share storage across accounts or even across apps installed in the same location.
   */
  storage: {
    /**
     * Returns a stored value from the database under `key` for the app (**without any reference to the instance**)
     * @param {string} key - Used to access to stored data
     */
    getItem(key: string): Promise<Response>;

    /**
     * Deletes a stored value from the database under `key` for the app (**without any reference to the instance**)
     * @param {string} key - Used to delete the stored data
     */
    deleteItem(key: string): Promise<DeleteResponse>;

    /**
     * Stores `value` under `key` in the database for the app  (**without any reference to the instance**)
     * @param {string} key - Used to delete the stored data
     * @param {any} value - The value to store
     * @param {object=} options
     * @param {string=} options.previous_version - Use the new version of the storage (instance-less)
     * @param {number=} options.ttl - The time to live of the item in seconds
     */
    setItem(key: string, value: any, options?: { previous_version?: string, ttl?: number }): Promise<SetResponse>;
    /***
     * The instance storage is a key-value database that is scoped to a specific app instance.
     * **Does not work** for instance-less apps.
     */
    instance: {
      /**
       * Returns a stored value from the database under `key` for a specific app instance
       * @param key
       */
      getItem(key: string): Promise<Response>;

      /**
       * Deletes a stored value from the database under `key` for a specific app instance
       * @param key
       */
      deleteItem(key: string): Promise<DeleteResponse>;

      /**
       * Stores `value` under `key` in the database for a specific app instance
       * @param key
       * @param value
       * @param options
       */
      setItem(key: string, value: any, options?: { previous_version?: string }): Promise<SetResponse>;
    };
  };
}
