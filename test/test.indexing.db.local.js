var _ = require('lodash');
var when = require('when');
var setup = require('./setup');
var should = require('chai').should();

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

  it('adapter score should be a function', function() {
    var adapter = collection.indexDb;
    _.isFunction(adapter.score).should.equal(true);
  });

  it('should reject with error if getting score (not implemented)', function() {
    return collection.score(model).then(function() {
      return when.reject(new Error('should not succeed'));
    }, function(err) {
      should.exist(err);
    });
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
