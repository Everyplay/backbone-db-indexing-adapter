# backbone-db-indexing-adapter

[![Build Status](https://travis-ci.org/Everyplay/backbone-db-indexing-adapter.png?branch=master)](https://travis-ci.org/Everyplay/backbone-db-indexing-adapter)

Interface for Backbone-db compatible adapters that can store indices

## IndexedDBAdapterInterface

Interface that compliant backbone-db adapter must implement

## IndexingDBLocal

[Backbone-db](https://github.com/Everyplay/backbone-db) adapter that implements IndexedDBAdapterInterface, storing indexes in memory/localStorage

### Usage:

```js
  var IndexingDBLocal = require('backbone-db-indexing-adapter').IndexingDBLocal;
  var store = new IndexingDBLocal('test');
```


## IndexedCollectionMixin

Mixin for Collections that use IndexedDBAdapterInterface compliant backbone-db adapter

### Usage:

```js
  exports.TestIndexedCollection = MyCollection.extend(
    _.extend({}, IndexedCollectionMixin, {
      indexDb: store
    })
  );
```


## Tests

    npm run test

