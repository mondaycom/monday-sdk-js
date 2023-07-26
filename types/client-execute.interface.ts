/**
 * Blocks that are supported by our SDK
 */
type BlockTypes = 'normal text' | 'large title' | 'medium title' | 'small title' | 'bulleted list' | 'numbered list' | 'quote' | 'check list' | 'code';

/**
 * Block content in delta format
 */
interface BlockContent { deltaFormat: Array<object> };
export interface ClientExecute {
    /**
     * Type fallback to account for new execute methods during the AI hackathon.
     * This will be removed when the 0.4.0 version goes out of beta.
     */
    execute (type: any, params?: any): Promise<any>;

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
   * Opens the provided link in a new tab.
   * @param type Which action to perform
   * @param params Optional parameters for the action
   */
  execute(
    type: 'openLinkInTab',
    params: {
      /**
       * The URL to open a new tab with
       */
      url: string;
    },
  ): Promise<{ data: Record<string, any> }>;
    /**
     * Doc command, This method adds multiple blocks to the beginning of a workdoc using HTML..
     * @param type Which action to perform
     */
    execute(type: 'addMultiBlocksFromHtml'): Promise<{ html: string }>;   /**
    /**
     * Doc command, This method opens the app modal on the first selected block when multiple are open.
     * @param type Which action to perform
     */
    execute(type: 'openAppOnFirstTextualSelectedBlock'): Promise<{ data: any }>;   /**
    /**
     * Doc command This method opens the app on the next block when multiple are selected. This is only available after calling the "openAppOnFirstTextualBlock" function.
     * @param type Which action to perform
     */
    execute(type: 'moveToNextSelectedTextualBlock'): Promise<{ data: any }>;   /**
    /**
     * Doc command This method opens the app on the next block when multiple are selected. This is only available after calling the "openAppOnFirstTextualBlock" function.
     * @param type Which action to perform
     */
    execute(type: 'moveToPrevSelectedTextualBlock'): Promise<{ data: any }>;   /**
    /**
     * Doc command, This method replaces the highlighted text with text of your choosing at the beginning of the block.
     * @param type Which action to perform
     */
    execute(type: 'replaceHighlightText'): Promise<{ text: string }>;    /**
    /**
     * Item Update section, This method creates or changes the content of an item's update.
     * @param type Which action to perform
     */
    execute(type: 'updatePostContentAction'): Promise<{ suggestedRephrase: string }>;    /**
     /**
     * This method closes the AI assistant's dialog.
     * @param type Which action to perform
     */
    execute(type: 'closeDialog'): Promise<{ data: any }>;    /**
     * Closes the modal window.
     * @param type Which action to perform
     */
    execute(type: 'closeAppFeatureModal'): Promise<{ data: any }>;
    /**
     * Notifies the monday platform when a user gains a first value in your app.
     * @param type Which action to perform
     */
    execute(type: 'valueCreatedForUser'): Promise<any>;
    /**
     * Adds a new block to a workdoc.
     * @param type Which action to perform
     * @param params The new block's data
     */
    execute(
        type: 'addDocBlock',
        params: {
            /**
             * The block type
             */
            type: BlockTypes;
            /**
             * Used to specify where in the doc the new block should go.
             * Provide the block's ID that will be above the new block.
             * Without this parameter, the block will appear at the top of the doc.
             */
            afterBlockId?: string | undefined;
            /**
             * The block's content in Delta format.
             */
            content: BlockContent;
        },
    ): Promise<any>;
    /**
     * Updates a block's content
     * @param type Which action to perform
     * @param params The updated block's data
     */
    execute (
        type: 'updateDocBlock',
        params: {
            /**
             * The block's unique identifier.
             */
            id: string;
            /**
             * The block's content you want to update in Delta format.
             */
            content: BlockContent;
        }
    ): Promise<any>;
    /**
     * Adds multiple blocks to a workdoc.
     * @param type Which action to perform
     * @param params Data for the new blocks you want to create
     */
    execute (
        type: 'addMultiBlocks',
        params: {
            /**
             * The block's unique identifier.
             */
            afterBlockId?: string | undefined;
            /**
             * The block's content in Delta format.
             * We support the following block types
             */
            blocks: Array<{ type: BlockTypes,  content: BlockContent}>;
        }
    ): Promise<any>;
    /**
     * Closes the document block modal. If you don't call this method, the modal will close when the user clicks outside of it.
     * @param type Which action to perform
     */
    execute (type: 'closeDocModal'): Promise<any>;
}
