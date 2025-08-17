/**
 * Module registry for auto-discovery and management of semantic modules
 */
class ModuleRegistry {
  constructor() {
    this.modules = new Map();
    this.instances = new Map();
  }

  /**
   * Register a semantic module
   * @param {string} name - Module name
   * @param {SemanticModule} moduleClass - Module class
   */
  register(name, moduleClass) {
    if (this.modules.has(name)) {
      console.warn(`Module '${name}' is already registered. Overwriting.`);
    }

    this.modules.set(name, moduleClass);
  }

  /**
   * Get a module instance (lazy loading)
   * @param {string} name - Module name
   * @param {Object} apiClient - API client instance
   * @param {boolean} isClientSdk - Whether this is a client SDK
   * @returns {Object|null} Module instance or null if not found
   */
  get(name, apiClient, isClientSdk = false) {
    const instanceKey = `${name}_${isClientSdk ? "client" : "server"}`;

    // Return cached instance if it exists
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey);
    }

    // Create new instance if module is registered
    const ModuleClass = this.modules.get(name);
    if (ModuleClass) {
      const instance = new ModuleClass(apiClient, isClientSdk);
      this.instances.set(instanceKey, instance);
      return instance;
    }

    return null;
  }

  /**
   * Get all registered module names
   * @returns {Array<string>} Array of module names
   */
  getAll() {
    return Array.from(this.modules.keys());
  }

  /**
   * Check if a module is registered
   * @param {string} name - Module name
   * @returns {boolean} True if module is registered
   */
  has(name) {
    return this.modules.has(name);
  }

  /**
   * Clear all registered modules and instances
   */
  clear() {
    this.modules.clear();
    this.instances.clear();
  }

  /**
   * Auto-register built-in modules
   */
  registerBuiltInModules() {
    try {
      // Register boards module
      const BoardsModule = require("../modules/BoardsModule");
      this.register("boards", BoardsModule);
    } catch (error) {
      // BoardsModule not yet available - will be registered later
    }

    try {
      // Register items module
      const ItemsModule = require("../modules/ItemsModule");
      this.register("items", ItemsModule);
    } catch (error) {
      // ItemsModule not yet available - will be registered later
    }

    try {
      // Register columns module
      const ColumnsModule = require("../modules/ColumnsModule");
      this.register("columns", ColumnsModule);
    } catch (error) {
      // ColumnsModule not yet available - will be registered later
    }
  }
}

// Create singleton instance
const moduleRegistry = new ModuleRegistry();

// Auto-register built-in modules on first load
moduleRegistry.registerBuiltInModules();

module.exports = moduleRegistry;
