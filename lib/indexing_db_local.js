/**
 * Backbone-db adapter that implements IndexedDBAdapterInterface,
 * storing indexes in memory/localStorage
 */
var _ = require('lodash');
var Db = require('backbone-db-local');
var debug = require('debug')('serverbone:utils:db:mock');
var async = require('async');
var IndexedDBAdapterInterface = require('./indexed_db_adapter_interface');

var IndexingDBLocal = function TestDb() {
  var db = Db.apply(this, arguments);
  this.storage = db.storage;
  this.records = db.records;
};

_.extend(IndexingDBLocal.prototype, Db.prototype, IndexedDBAdapterInterface, {
  addToIndex: function(collection, model, options, cb) {
    var self = this;
    debug('add ' + model.id + ' to ' + options.indexKey);
    this.store().getItem(options.indexKey, function(err, items) {
      if (err) return cb(err);
      if (!items) {
        items = [];
      } else {
        items = JSON.parse(items);
      }
      if (_.findIndex(items, {id: model.id}) >= 0) {
        // item was already existing
        return cb();
      }
      if (collection.indexSort) {
        // NB: the default order is reverse in BackboneDb backends
        var newItem = {id: model.id, score: -collection.indexSort(model)};
        var pos = _.sortedIndex(items, newItem, 'score');
        items.splice(pos, 0, newItem);
      } else {
        items.push({id: model.id});
      }
      self.store().setItem(
        options.indexKey,
        JSON.stringify(items),
        function(storeErr) {
          if (storeErr) {
            cb(storeErr);
          } else {
            cb(null, 1);
          }
        });
    });
  },

  readFromIndex: function(collection, options, cb) {
    this.store().getItem(options.indexKey, function(err, items) {
      if (err) return cb(err);
      if (!items) {
        return cb(null, []);
      }
      items = _.isString(items) ? JSON.parse(items) : items;
      if (options.sortOrder === 1) items.reverse();
      if (options.limit) {
        items = items.splice(options.offset || 0, options.limit);
      }
      var models = [];
      _.each(items, function(item) {
        models.push({
          id: item.id
        });
      });
      collection.set(models, options);
      return cb(null, models);
    });
  },

  readFromIndexes: function(collection, options, cb) {
    var indexesToRead = options.indexKeys;
    var fns = _.map(indexesToRead, function(key) {
      var store = this.store();
      return function getItem(_cb) {
        store.getItem(key, function(err, items) {
          if (_.isString(items)) items = JSON.parse(items);
          _cb(err, _.pluck(items, 'id'));
        });
      };
    }, this);

    async.parallel(fns, function(err, results) {
      if (err) return cb(err);
      // join results
      var models = [];
      var allIds = [];
      _.each(results, function(ids) {
        allIds = allIds.concat(ids);
      });
      _.each(_.uniq(_.compact(allIds)), function(id) {
        models.push({
          id: id
        });
      });
      collection.set(models, options);
      return cb(err, models);
    });
  },

  removeFromIndex: function(collection, models, options, cb) {
    var self = this;
    var ids = _.pluck(models, models[0].idAttribute);
    debug('removing ' + ids + ' from ' + options.indexKey);
    this.store().getItem(options.indexKey, function(err, items) {
      items = _.isString(items) ? JSON.parse(items) : items || [];
      var oldLen = items.length;
      items = _.reject(items, function(item) {
        return ids.indexOf(item.id) > -1;
      });
      var numRemoved = oldLen - items.length;
      self.store().setItem(
        options.indexKey,
        JSON.stringify(items),
        function(storeErr) {
          if (storeErr) {
            cb(storeErr);
          } else {
            cb(null, numRemoved);
          }
        }
      );
    });
  },

  // removes everything from index
  removeIndex: function(collection, options, cb) {
    this.store().setItem(
      options.indexKey,
      JSON.stringify([]),
      function(err, res) {
        cb(err, [], res);
      }
    );
  },

  existsInIndex: function(collection, model, options, cb) {
    this.store().getItem(options.indexKey, function(err, items) {
      items = items ? JSON.parse(items) : [];
      cb(err, _.findIndex(items, {id: model.id}) > -1);
    });
  },

  indexCount: function(collection, options, cb) {
    this.store().getItem(options.indexKey, function(err, items) {
      items = items ? JSON.parse(items) : [];
      cb(err, items.length);
    });
  },

  // mock adapter only supports exact match
  findKeys: function(collection, options, cb) {
    var ids = [];
    var keys = _.isFunction(collection.url) ? collection.url() : collection.url;
    keys += options.keys;
    debug('findKeys', keys);
    this.store().getItem(keys, function(err, data) {
      if (data) ids.push(keys);
      cb(null, ids);
    });
  }
});

IndexingDBLocal.sync = IndexingDBLocal.prototype.sync;

module.exports = IndexingDBLocal;
