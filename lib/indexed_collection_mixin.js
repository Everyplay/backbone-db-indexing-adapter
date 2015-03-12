/**
 * Mixin for Collections that use IndexedDBAdapterInterface compliant backbone-db adapter
 */
var _ = require('lodash');
var nodefn = require('when/node');

module.exports = {
  /*
   * Adds a new model to the index. Only specified attribute is indexed.
   * Db adapter returns a Promise
   */
  addToIndex: function(model, options) {
    options = options ? _.clone(options) : {};
    if (!(model = this._prepareModel(model, options))) return false;
    if (!options.wait) this.add(model, options);
    return this._callAdapter('addToIndex', options, model);
  },

  /*
   * Read model ids from the index. Populates collection models with ids,
   * for fetching from the main storage.
   */
  readFromIndex: function(options) {
    return this._callAdapter('readFromIndex', options);
  },

  /*
   * Read from multiple indexes
   */
  readFromIndexes: function(options) {
    options = options ? _.clone(options) : {};
    options.indexKeys = this.indexKeys || options.indexKeys;
    options.unionKey = this.unionKey || options.unionKey;
    if (this.indexKey) options.indexKeys.push(this.indexKey);
    var args = [this, options];
    return nodefn.apply(_.bind(this.indexDb.readFromIndexes, this.indexDb), args);
  },

  /*
   * Removes a model from index
   */
  removeFromIndex: function(models, options) {
    if(!models) return false;
    this.remove(models, options);
    var singular = !_.isArray(models);
    models = singular ? [models] : _.clone(models);
    return this._callAdapter('removeFromIndex', options, models);
  },

  destroyAll: function(options) {
    return this._callAdapter('removeIndex', options);
  },

  /*
   *  Check if model exists in index
   */
  exists: function(model, options) {
    return this._callAdapter('existsInIndex', options, model);
  },

  score: function(model, options) {
    return this._callAdapter('score', options, model);
  },

  /*
   * Get count of items in index
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
    return nodefn.apply(_.bind(this.indexDb[fn], this.indexDb), args);
  }
};
