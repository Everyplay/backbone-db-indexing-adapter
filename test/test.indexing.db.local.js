var setup = require('./setup');
require('chai').should();

describe('IndexingDBLocal tests', function() {
  var collection = new setup.TestIndexedCollection();
  var model = new setup.MyModel({id: 'foo'});

  it('should add a model to index', function() {
    return collection.addToIndex(model);
  });

  it('should read ids from index', function() {
    return collection
      .readFromIndex()
      .then(function() {
        collection.length.should.equal(1);
        var m = collection.at(0);
        m.id.should.equal('foo');
      });
  });

  it('should check if model exists', function() {
    return collection
      .exists(model)
      .then(function(exists) {
        exists.should.equal(true);
      });
  });

  it('should get count', function() {
    return collection
      .count()
      .then(function(count) {
        count.should.equal(1);
      });
  });

  it('should throw if getting score for non-sorted collection', function() {
    var score = function() {
      collection.score(model);
    };
    score.should.throw();
  });

  it('should remove model from index', function() {
    return collection
      .removeFromIndex(model);
  });

  it('should get count after deletion', function() {
    return collection
      .count()
      .then(function(count) {
        count.should.equal(0);
      });
  });

  it('should remove the index', function() {
    return collection.destroyAll();
  });


});
