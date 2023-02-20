export interface ClientExecute {
    /**
     * Opens a popup card with information from the selected item
     * @param type Which action to perform
     * @param params Optional parameters for the action
     */
    execute(
        type: 'openItemCard',
        params: {
            /**
             * The ID of the item to open
             */
            itemId: number;

            /**
             * On which view to open the item card.
             * Can be "updates" / "columns"
             * Defaults to "columns"
             */
            kind?: 'updates' | 'columns' | undefined;
        },
    ): Promise<any>;
    /**
     * Opens a confirmation dialog to the user **type** `'confirm'`
     * @param type Which action to perform
     * @param params Optional parameters for the action
     */
    execute(
        type: 'confirm',
        params: {
            /**
             * The message to display in the dialog
             */
            message: string;

            /**
             * The text for the confirmation button
             * Defaults to "OK"
             */
            confirmButton?: string | undefined;

            /**
             * The text for the cancel button
             * Defaults to "Cancel"
             */
            cancelButton?: string | undefined;

            /**
             * Either to exclude the cancel button
             * Defaults to `false`
             */
            excludeCancelButton?: boolean | undefined;
        },
    ): Promise<{ data: { confirm: boolean } }>;
    /**
     * Display a message at the top of the user's page. Useful for success, error & general messages.
     * @param type Which action to perform
     * @param params Optional parameters for the action
     */
    execute(
        type: 'notice',
        params: {
            /**
             * The message to display
             */
            message: string;

            /**
             * The type of message to display. Can be "success" (green), "error" (red) or "info" (blue)
             * Defaults to "info"
             */
            type?: 'success' | 'error' | 'info' | undefined;

            /**
             * The number of milliseconds to show the message until it closes
             * Defaults to 5000
             */
            timeout?: number | undefined;
        },
    ): Promise<any>;
    /**
     * Opens a modal with the preview of an asset
     * @param type Which action to perform
     * @param params Optional parameters for the action
     */
    execute(
        type: 'openFilesDialog',
        params: {
            /**
             * The ID of the board
             */
            boardId: number;

            /**
             * The ID of the item, which contains an asset
             */
            itemId: number;

            /**
             * The ID of the column, which contains an asset
             */
            columnId: string;

            /**
             * The ID of the asset to open
             */
            assetId: number;
        },
    ): Promise<any>;
    /**
     * Opens a modal to let the current user upload a file to a specific file column.
     *
     * Returns a promise. In case of error, the promise is rejected
     *
     * After the file is successfully uploaded, the "change_column_value" event will be triggered. See the {@link listen} method to subscribe to these events.
     *
     * _Requires boards:write scope_
     * @param type Which action to perform
     * @param params Optional parameters for the action
     */
    execute(
        type: 'triggerFilesUpload',
        params: {
            /**
             * The ID of the board
             */
            boardId: number;

            /**
             * The ID of the item, which contains an asset
             */
            itemId: number;

            /**
             * The ID of the file column, where file should be uploaded
             */
            columnId: string;
        },
    ): Promise<any>;
    /**
     * Opens a new modal window as an iFrame.
     * @param type Which action to perform
     * @param params Optional parameters for the action
     */
    execute(
        type: 'openAppFeatureModal',
        params: {
            /**
             * The URL of the page displayed in the modal
             * Defaults to current iFrame's URL
             */
            url?: string;

            /**
             * Subdirectory or path of the URL to open
             */
            urlPath?: string;

            /**
             * Query parameters for the URL
             */
            urlParams?: Record<string, string>;

            /**
             * The width of the modal
             * Defaults to "0px"
             */
            width?: string;

            /**
             * The height of the modal
             * Defaults to "0px"
             */
            height?: string;
        },
    ): Promise<{ data: any }>;
    /**
     * Closes the modal window.
     * @param type Which action to perform
     * @param params Optional parameters for the action
     */
    execute(type: 'closeAppFeatureModal'): Promise<{ data: any }>;
}