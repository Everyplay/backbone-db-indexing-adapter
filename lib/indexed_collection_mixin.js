/**
 * Mixin for Collections that use IndexedDBAdapterInterface compliant backbone-db adapter
 */
var _ = require('lodash');
var nodefn = require('when/node');

module.exports = {
  /**
   * Adds a new model key to the index.
   * @param {Model} model   model whose key (id) is added to index
   * @param {Object} options options
   * @returns {Promise} promise
   */
  addToIndex: function(model, options) {
    options = options ? _.clone(options) : {};
    if (!(model = this._prepareModel(model, options))) return false;
    if (!options.wait) this.add(model, options);
    return this._callAdapter('addToIndex', options, model);
  },

  /**
   * Read all keys from the index. These may be limited with options
   * @param {Object} options options
   * @returns {Promise} promise
   */
  readFromIndex: function(options) {
    return this._callAdapter('readFromIndex', options);
  },

  /**
   * Read all keys from multiple indexes.
   * @param {Object} options options
   * @returns {Promise} promise
   */
  readFromIndexes: function(options) {
    options = options ? _.clone(options) : {};
    options.indexKeys = this.indexKeys || options.indexKeys;
    options.unionKey = this.unionKey || options.unionKey;
    if (this.indexKey) options.indexKeys.push(this.indexKey);
    var args = [this, options];
    return nodefn.apply(_.bind(this.indexDb.readFromIndexes, this.indexDb), args);
  },

  /**
   * Removes a model's key from index
   * @param {Array} models   model(s) whose keys (ids) are removed from index
   * @param {Object} options options
   * @returns {Promise} promise
   */
  removeFromIndex: function(models, options) {
    if(!models) return false;
    this.remove(models, options);
    var singular = !_.isArray(models);
    models = singular ? [models] : _.clone(models);
    return this._callAdapter('removeFromIndex', options, models);
  },

  /**
   * Removes the index
   * @param {Object} options options
   * @returns {Promise} promise
   */
  destroyAll: function(options) {
    return this._callAdapter('removeIndex', options);
  },

  /**
   * Check if model key exists in index
   * @param {Model} model   model whose key (id) is added to index
   * @param {Object} options options
   * @returns {Promise} promise
   */
  exists: function(model, options) {
    return this._callAdapter('existsInIndex', options, model);
  },

  /**
   * Get score of model's key in the index
   * @param {Model} model   model whose key (id) is added to index
   * @param {Object} options options
   * @returns {Promise} promise
   */
  score: function(model, options) {
    return this._callAdapter('score', options, model);
  },

  /**
   * Get total count of items in index
   * @param {Model} model   model whose key (id) is added to index
   * @param {Object} options options
   * @returns {Promise} promise
   */
  count: function(options) {
    return this._callAdapter('indexCount', options);
  },

  findKeys: function(keys, options) {
    options = options ? _.clone(options) : {};
    options.keys = keys;
    return this._callAdapter('findKeys', options);
  },

  _callAdapter: function(fn, options, models) {
    options = options ? _.clone(options) : {};
    if (!this.indexDb) {
      throw new Error('indexDb must be defined');
    }
    options.indexKey = this.indexKey;
    var args = [this, options];
    if (models) args.splice(1, 0, models);
    if (!_.isFunction(this.indexDb[fn])) {
      throw new Error('indexDb does not implement ' + fn);
    }
    return nodefn.apply(_.bind(this.indexDb[fn], this.indexDb), args);
  }
};
