var vows    = require('vows'),
    assert = require('assert');

var visitManager = require('../visit-manager');

var VisitManager   = visitManager.VisitManager;

vows.describe('VisitManager').addBatch({
    'updateLocation': {
        topic: new(VisitManager),

        'can call save': function (manager) {
            assert.equal (manager.save(), true);
        }
    }
}).export(module); // Export the Suite