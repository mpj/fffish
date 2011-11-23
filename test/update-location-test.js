var vows    = require('vows'),
    assert = require('assert');

var visitManager = require('../visit-manager');

var VisitManager   = visitManager.VisitManager;

vows.describe('VisitManager').addBatch({
    'given a VisitManager exists': {
        topic: new(VisitManager),

        'and we call save': {
        	topic: function(manager) {
        		manager.save(this.callback);
        	},
        	'returns true': function(result) {
        		assert.equal(result, true)
        	}
        }
    }
}).export(module); // Export the Suite