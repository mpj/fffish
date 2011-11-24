var vows    = require('vows'),
    assert = require('assert');

var visitManager = require('../visit-manager');
var MockMongo	 = require('./mock-mongo').MockServer;

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
		var mongo = getTopic(this, MockMongo);
		assert.isTrue(mongo.collection_called(collName));
	}
}

function assertInsertCalled(doc, suite) {
	var mongo = getTopic(suite, MockMongo);
	assert.isTrue( 
		mongo.current_collection.insert_called(doc)
	);
}

vows.describe('VisitManager').addBatch({
    'given that we have a mock mongo server': {
    	topic: new MockMongo(),
    
	    'given a VisitManager exists': {
	        topic: function(mongo) {
	        	return {
	        		mongo: mongo,
	        		manager: new VisitManager(mongo)
	        	}
	        },

	        'and we call save with some parameters': {
	        	topic: function(topic) {
	        		topic.manager.save('999991', 123.4, 456.7, this.callback);
	        	},

	        	'it should have called collection "visits"': 
	        		assertCollectionCalled('visits')
	        	,

	        	'callback returns true': function(result) {
	        		assert.equal(result, true);
	        	}
	        },

	        'mongo_insert_should_have_been_called': function(topic){
	        	assertInsertCalled({ id: '999991', lat: 123.4, lon: 456.7}, this);
	        }
	    }
    }
}).export(module); // Export the Suite