var vows    = require('vows'),
    assert = require('assert');

var visitManager = require('../visit-manager');
var MockMongo	 = require('./mock-mongo').MockServer;

var VisitManager   = visitManager.VisitManager;

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
		        	function() {
		        		var mongo = 
		        			this.context.topics[this.context.topics.length-1];
		        		assert.isTrue(mongo.collection_called('visits'));
		        	},

	        	'callbck returns true': function(result) {
	        		assert.equal(result, true);
	        	}
	        },

	        'mongo_store_should_have_been_called': function(topic){
	        	var mongo = this.context.topics[0].mongo;
	        	assert.isTrue(
		        	mongo.current_collection.insert_called(
		        		'999991', 123.4, 456.7
		        ));
	        }
	    }
    }
}).export(module); // Export the Suite