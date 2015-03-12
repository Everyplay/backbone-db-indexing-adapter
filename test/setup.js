var _ = require('lodash');
var Promises = require('backbone-promises');
var Model = Promises.Model;
var Collection = Promises.Collection;
var IndexingDBLocal = require('..').IndexingDBLocal;
var IndexedCollectionMixin = require('..').IndexedCollectionMixin;
var store = new IndexingDBLocal('test');

var MyModel = exports.MyModel = Model.extend({
  db: store,
  sync: store.sync,
  type: 'mymodel'
});

var MyCollection = exports.MyCollection = Collection.extend({
  db: store,
  sync: store.sync,
  model: MyModel,
  type: 'mymodels'
});

exports.TestIndexedCollection = MyCollection.extend(
  _.extend({}, IndexedCollectionMixin, {
    indexDb: store
  })
);
