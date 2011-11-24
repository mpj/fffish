exports.VisitManager = function (server) {
    this.server = server;
};
exports.VisitManager.prototype = {
    save: function (id, lat, lon, callback) {
    	this.server.collection('visits', function(err, coll) {
    		coll.ensureIndex( { loc: '2d' } );
    		var doc = {
    			'id': id,
    			'loc': [lat, lon]
    		}
    		coll.insert(doc, function(err, doc) {
    			callback(true);
    		});
    	});
    }
};