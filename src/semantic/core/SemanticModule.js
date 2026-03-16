/**
 * Base class for all semantic modules
 */
class SemanticModule {
  constructor(sdk, isClientSdk = false) {
    this.sdk = sdk;
    this.isClientSdk = isClientSdk;
  }

  /**
   * Static properties - to be overridden by subclasses
   */
  static get name() {
    throw new Error("SemanticModule subclasses must define a static name property");
  }

  static get version() {
    return "1.0.0";
  }

  static get dependencies() {
    return [];
  }

  /**
   * Execute a GraphQL query using the underlying API client
   * @param {string} query - GraphQL query string
   * @param {Object} variables - GraphQL variables
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} GraphQL response
   */
  async _executeQuery(query, variables = {}, options = {}) {
    const queryOptions = {
      variables,
      ...options
    };

    return this.sdk.api(query, queryOptions);
  }

  /**
   * Wrapper for API calls with error handling
   * @param {string} operation - Name of the operation for error context
   * @param {Function} apiCall - Function that performs the API call
   * @returns {Promise<*>} Result of the API call
   */
  async _handleApiCall(operation, apiCall) {
    const { handleApiError } = require("./SemanticError");

    try {
      return await apiCall();
    } catch (error) {
      throw handleApiError(error, operation, {
        module: this.constructor.name,
        isClientSdk: this.isClientSdk
      });
    }
  }
}

module.exports = SemanticModule;
