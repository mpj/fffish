var vows    = require('vows'),
    assert = require('assert');

var visitManager = require('../visit-manager');

var VisitManager   = visitManager.VisitManager;

vows.describe('VisitManager').addBatch({
    'given that we have a mock mongo server': {
    	topic: function() {
    		return {
    			id: 0,
    			lat: 0,
    			long: 0,
    			store_was_called_with_params: function(id, lat, long) {
    				return (
	    				this.id == id &&
    					this.lat == lat && 
    					this.long == long);
	    		},
    			store: function(id, lat, long) {
    				this.id = id;
    				this.lat = lat;
    				this.long = long;
    				return true;
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

	        'and we call save with some parameters': {
	        	topic: function(topic) {
	        		topic.manager.save('999991', 123.4, 456.7, this.callback);
	        	},
	        	'returns true': function(result) {
	        		assert.equal(result, true);
	        	}
	        },

	        'mongo_store_should_have_been_called': function(topic){
	        	assert.isTrue(
		        	topic.mongo.store_was_called_with_params(
		        		'999991', 123.4, 456.7
		        ));
	        }
	    }
    }
}).export(module); // Export the Suite