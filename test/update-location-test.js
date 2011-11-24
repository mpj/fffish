var vows    = require('vows'),
    assert = require('assert');

var visitManager = require('../visit-manager');
var MockMongo  = require('./mock-mongo').MockServer;

var VisitManager   = visitManager.VisitManager;

// Iterates through the topics of a test suite
// and returns the one matching the provided type.
function getTopic(suite, type) {
  var topics = suite.context.topics;
  for(var i = 0; i<topics.length; i++) {
    var topic = topics[i];
    if (topic instanceof type)
      return topic;
  }
  throw Error('Topic if type '+ type + 'not found');
}

function assertCollectionCalled(collName) {
  return function() {
    assert.isTrue(
      this.mock_mongo.collection_called(collName));
  }
}

function assertInsertCalled(doc) {
  return function() {
    var coll = this.mock_mongo.current_collection;
    assert.isTrue( coll.insert_called(doc) );
  }
}

function assertEnsureIndexCalled(index) {
  return function() {
    var coll = this.mock_mongo.current_collection;
    assert.isTrue( coll.ensure_index_called(index) );
  }
}


function managerSave(id, lat, lon) {
  return function(manager) {
    manager.save(id, lat, lon, this.callback);
  }
}

vows.describe('VisitManager').addBatch({

  'save': {
    topic: function(mongo) {
      this.mock_mongo = new MockMongo();
      return new VisitManager(this.mock_mongo)
    },

    'given that we call save with some parameters': {
      topic: managerSave('999991', 123.4, 456.7),

      'collection called': assertCollectionCalled('visits'),

      'ensureIndex called': assertEnsureIndexCalled({ loc: '2d' }),

      'insert called': assertInsertCalled(
        { id: '999991', loc: [ 123.4, 456.7 ] }),

      'result is true': function(result) {
        assert.isTrue(result);
      }
    },
  }

}).export(module); // Export the Suite