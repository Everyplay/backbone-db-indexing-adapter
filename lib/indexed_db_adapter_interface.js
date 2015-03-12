/**
 * Interface that compliant backbone-db adapter must implement
 */

/*eslint no-unused-vars: 0*/

module.exports = {
  /**
   * Adds model's key to this index.
   *
   * @param {Collection}  collection  instance of indexed collection
   * @param {Model}       model       Model to be added to index
   * @param {Object}      options     Options for adding
   * @param {Function}    cb          Callback function
   */
  addToIndex: function(collection, model, options, cb) {
    throw new Error('Not implemented');
  },

  /**
   * Read data from the index
   *
   * @param {Collection}  collection  instance of indexed collection
   * @param {Object}      options     Options for reading
   * @param {Function}    cb          Callback function
   */
  readFromIndex: function(collection, options, cb) {
    throw new Error('Not implemented');
  },

  /**
   * Read data from multiple indexes
   *
   * @param {Collection}  collection  instance of indexed collection
   * @param {Object}      options     Options for reading
   * @param {Function}    cb          Callback function
   */
  readFromIndexes: function(collection, options, cb) {
    throw new Error('Not implemented');
  },

  /**
   * Remove models' keys from this index.
   *
   * @param {Collection}  collection  instance of indexed collection
   * @param {Array}       models      Models to be removed from index
   * @param {Object}      options     Options for removing
   * @param {Function}    cb          Callback function
   */
  removeFromIndex: function(collection, models, options, cb) {
    throw new Error('Not implemented');
  },

  /**
   * Removes the index completely
   *
   * @param {Collection}  collection  instance of indexed collection
   * @param {Object}      options     Options
   * @param {Function}    cb          Callback function
   */
  removeIndex: function(collection, options, cb) {
    throw new Error('Not implemented');
  },

  /**
   * Check if model exists in this index
   *
   * @param {Collection}  collection  instance of indexed collection
   * @param {Model}       model       Model to be checked
   * @param {Object}      options     Options
   * @param {Function}    cb          Callback function
   */
  existsInIndex: function(collection, model, options, cb) {
    throw new Error('Not implemented');
  },

  /**
   * Get number of items in the index
   * @param {Collection}  collection  instance of indexed collection
   * @param {Object}      options     Options
   * @param {Function}    cb          Callback function
   */
  indexCount: function(collection, options, cb) {
    throw new Error('Not implemented');
  },

  /**
   * Return the score of model in this index
   * @param {Collection}  collection  instance of indexed collection,
   *                                  should have indexSort defined
   * @param {Model}       model       Model whose score is to be fetched
   * @param {Object}      options     Options
   * @param {Function}    cb          Callback function
   */
  score: function(collection, model, options, cb) {
    throw new Error('Not implemented');
  }
};
