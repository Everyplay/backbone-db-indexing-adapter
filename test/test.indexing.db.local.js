var setup = require('./setup');
require('chai').should();

describe('IndexingDBLocal tests', function() {
  var collection = new setup.TestIndexedCollection();

  it('should add a model to index', function() {
    var model = new setup.MyModel({id: 'foo'});
    return collection.addToIndex(model);
  });

  it('should read ids from index', function() {
    return collection
      .readFromIndex()
      .then(function() {
        collection.length.should.equal(1);
        var model = collection.at(0);
        model.id.should.equal('foo');
      });
  });
});
