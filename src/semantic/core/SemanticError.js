/**
 * Custom error classes for semantic API operations
 */

/**
 * Base semantic error class
 */
class SemanticError extends Error {
  constructor(message, originalError, operation, context) {
    super(message);
    this.name = "SemanticError";
    this.originalError = originalError;
    this.operation = operation;
    this.context = context;
  }
}

/**
 * Board-specific error class
 */
class BoardError extends SemanticError {
  constructor(message, originalError, operation, context) {
    super(message, originalError, operation, context);
    this.name = "BoardError";
  }
}

/**
 * Item-specific error class
 */
class ItemError extends SemanticError {
  constructor(message, originalError, operation, context) {
    super(message, originalError, operation, context);
    this.name = "ItemError";
  }
}

/**
 * Column-specific error class
 */
class ColumnError extends SemanticError {
  constructor(message, originalError, operation, context) {
    super(message, originalError, operation, context);
    this.name = "ColumnError";
  }
}

/**
 * Handle API errors and convert them to semantic error objects
 * @param {Error} error - Original error
 * @param {string} operation - Operation that failed
 * @param {Object} context - Context information for debugging
 * @param {Object} options - Error handling options
 * @param {boolean} options.rawErrors - Return raw errors without transformation
 * @returns {SemanticError} Wrapped error
 */
function handleApiError(error, operation, context = {}, options = {}) {
  // Return raw error if requested
  if (options.rawErrors) {
    throw error;
  }

  let message = `Failed to ${operation}`;

  if (error && error.message) {
    // Extract meaningful error messages
    if (error.message.includes("GraphQL Error")) {
      message = error.message;
    } else if (error.message.includes("Token is required")) {
      message = "Authentication token is required for this operation";
    } else if (error.message.includes("timeout")) {
      message = "Request timed out. Please try again.";
    } else {
      message = `${message}: ${error.message}`;
    }
  } else if (typeof error === "string") {
    message = `${message}: ${error}`;
  } else if (error && typeof error === "object") {
    message = `${message}: ${JSON.stringify(error)}`;
  } else {
    message = `${message}: Unknown error`;
  }

  // Determine appropriate error class based on operation name
  if (operation.toLowerCase().includes("board")) {
    throw new BoardError(message, error, operation, context);
  } else if (operation.toLowerCase().includes("item")) {
    throw new ItemError(message, error, operation, context);
  } else if (operation.toLowerCase().includes("column")) {
    throw new ColumnError(message, error, operation, context);
  }

  // Default to base SemanticError
  throw new SemanticError(message, error, operation, context);
}

/**
 * Validate input parameters for semantic operations
 * @param {Object} params - Parameters to validate
 * @param {Array<string>} required - Required parameter names
 * @throws {SemanticError} If validation fails
 */
function validateParameters(params, required) {
  for (const param of required) {
    if (params[param] === undefined || params[param] === null) {
      throw new SemanticError(`Required parameter '${param}' is missing`, null, "validateParameters", {
        params,
        required
      });
    }
  }
}

/**
 * Validate and convert ID parameters
 * @param {string|number} id - ID to validate
 * @param {string} paramName - Parameter name for error messages
 * @returns {number} Validated integer ID
 * @throws {SemanticError} If ID is invalid
 */
function validateId(id, paramName = "id") {
  const numericId = parseInt(id);

  if (isNaN(numericId) || numericId <= 0) {
    throw new SemanticError(`Invalid ${paramName}: must be a positive integer`, null, "validateId", { id, paramName });
  }

  return numericId;
}

module.exports = {
  SemanticError,
  BoardError,
  ItemError,
  ColumnError,
  handleApiError,
  validateParameters,
  validateId
};
