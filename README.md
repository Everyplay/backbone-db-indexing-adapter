# backbone-db-indexing-adapter

[![Build Status](https://travis-ci.org/Everyplay/backbone-db-indexing-adapter.png?branch=master)](https://travis-ci.org/Everyplay/backbone-db-indexing-adapter)

Interface for Backbone-db compatible adapters that can store indices.

## IndexedDBAdapterInterface

Interface that compliant backbone-db adapter must implement. Interface defines the following methods:

### addToIndex

Adds a key to index.

### readFromIndex

Read keys from the index.

### readFromIndexes

Read keys from multiple indexes.

### removeFromIndex

Remove models' keys from index.

### removeIndex

Removes the index completely.

### existsInIndex

Check if key exists in the index.

### indexCount

Get number of keys in the index.

### score

Return the score of key in the index.


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
  var TestIndexedCollection = MyCollection.extend(
    _.extend({}, IndexedCollectionMixin, {
      indexDb: store
    })
  );
  var c = new TestIndexedCollection();
  return c.readFromIndex().then(...);
```


## Tests

    npm run test

