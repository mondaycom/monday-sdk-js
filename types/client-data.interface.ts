type SubscribableEvents = 'context' | 'settings' | 'itemIds' | 'events';

type SettableTypes = 'settings';

interface GetResponse {
    value: any;
    version: any;
}

interface SetResponse {
    success: boolean;
    reason?: string | undefined;
}

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
    get(type: 'context' | 'settings' | 'itemIds' | 'sessionToken', params?: object): Promise<any>;

    /**
     * Creates a listener which allows subscribing to certain types of client-side events.
     * @param typeOrTypes The type, or array of types, of events to subscribe to
     * @param callback A callback function that is fired when the listener is triggered by a client-side event
     * @param params Reserved for future use
     */
    listen(
        typeOrTypes: SubscribableEvents | ReadonlyArray<SubscribableEvents>,
        callback: (res: { data: object }) => void,
        params?: object,
    ): void;
    
    /**
     * Set data in your application, such as updating settings
     * @param type The type of data that can be set
     * @param params object containing the data you want to update
     */
    set(
        type: SettableTypes, 
        params: object,
    ): Promise<any>;

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
        instance: {
            /**
             * Returns a stored value from the database under `key`
             * @param key
             */
            getItem(key: string): Promise<{ data: GetResponse }>;

            /**
             * Stores `value` under `key` in the database
             * @param key
             * @param value
             */
            setItem(key: string, value: any): Promise<SetResponse>;
        };
    };    
}