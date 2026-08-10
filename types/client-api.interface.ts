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
     * Performs a client-side redirection of the user to the monday OAuth screen with your client ID embedded in the URL,
     * in order to get their approval to generate a temporary OAuth token based on your requested permission scopes.
     * @param object An object with options
     */
    oauth(object?: OAuthOptions): void;
}
