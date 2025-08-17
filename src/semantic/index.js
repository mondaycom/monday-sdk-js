const moduleRegistry = require("./core/ModuleRegistry");

/**
 * Create semantic API instances for the given SDK
 * @param {Object} sdk - The monday SDK instance (client or server)
 * @returns {Object} Semantic API instances
 */
function createSemanticAPI(sdk) {
  // Determine if this is a client SDK
  const isClientSdk = !!sdk._clientId;

  // Create proxy object that dynamically returns module instances
  const semanticAPI = {};

  // Get all registered modules and create getters for them
  const registeredModules = moduleRegistry.getAll();

  registeredModules.forEach(moduleName => {
    Object.defineProperty(semanticAPI, moduleName, {
      get() {
        return moduleRegistry.get(moduleName, sdk, isClientSdk);
      },
      enumerable: true,
      configurable: true
    });
  });

  return semanticAPI;
}

/**
 * Register a new semantic module
 * @param {string} name - Module name
 * @param {SemanticModule} moduleClass - Module class
 */
function registerModule(name, moduleClass) {
  moduleRegistry.register(name, moduleClass);
}

/**
 * Get the module registry instance
 * @returns {ModuleRegistry} Module registry
 */
function getRegistry() {
  return moduleRegistry;
}

// Re-export core classes for external use
const SemanticModule = require("./core/SemanticModule");
const { SemanticError, BoardError, ItemError, ColumnError } = require("./core/SemanticError");
const {
  parseGraphQLResponse,
  formatBoardData,
  formatItemData,
  formatColumnData
} = require("./core/ResponseTransformer");

module.exports = {
  createSemanticAPI,
  registerModule,
  getRegistry,
  SemanticModule,
  SemanticError,
  BoardError,
  ItemError,
  ColumnError,
  parseGraphQLResponse,
  formatBoardData,
  formatItemData,
  formatColumnData
};
