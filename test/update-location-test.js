var vows    = require('vows'),
    assert = require('assert');

var visitManager = require('../visit-manager');

var VisitManager   = visitManager.VisitManager;

vows.describe('VisitManager').addBatch({
    'given that we have a mock mongo server': {
    	topic: function() {
    		return {
    			store_was_called: false,
    			store: function() {
    				this.store_was_called = true;
    			}
    		}	
    	},
    
	    'given a VisitManager exists': {
	        topic: function(fake_mongo) {
	        	return {
	        		mongo: fake_mongo,
	        		manager: new VisitManager(fake_mongo)
	        	}
	        },

	        'and we call save': {
	        	topic: function(topic) {
	        		topic.manager.save(this.callback)
	        		return 
	        	},
	        	'returns true': function(result) {
	        		assert.equal(result, true)
	        	}
	        },

	        'mongo_store_should_have_been_called': function(topic){
	        	assert.equal(topic.mongo.store_was_called, true);
	        }
	    }
    }
}).export(module); // Export the Suite