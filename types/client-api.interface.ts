interface APIOptions {
    /**
     * Access token for the API
     * If not set, will use the credentials of the current user (client only)
     */
    token?: string | undefined;

    /**
     * An object containing GraphQL query variables
     */
    variables?: object | undefined;
}

interface OAuthOptions {
    /**
     * The OAuth client ID of the requesting application
     * Defaults to your client ID
     */
    clientId?: string | undefined;

    /**
     * The URL of the monday OAuth endpoint
     */
    mondayOauthUrl?: string | undefined;
}

export interface ClientApi {
    /**
     * Used for querying the monday.com GraphQL API seamlessly on behalf of the connected user, or using a provided API token.
     * For more information about the GraphQL API and all queries and mutations possible, read the [API Documentation](https://monday.com/developers/v2)
     * @param query A [GraphQL](https://graphql.org/) query, can be either a query (retrieval operation) or a mutation (creation/update/deletion operation).
     * Placeholders may be used, which will be substituted by the variables object passed within the options.
     * @param options
     */
    api(query: string, options?: APIOptions): Promise<{ data: object }>;

    /**
     * Instead of passing the API token to the `api()` method on each request, you can set the API token once using:
     * @param token Access token for the API
     */
    setToken(token: string): void;

    /**
     * Performs a client-side redirection of the user to the monday OAuth screen with your client ID embedded in the URL,
     * sin order to get their approval to generate a temporary OAuth token based on your requested permission scopes.
     * @param object An object with options
     */
    oauth(object?: OAuthOptions): void;
}