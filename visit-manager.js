exports.VisitManager = function (server) {
    this.server = server;
};
exports.VisitManager.prototype = {
    save: function (id, lat, long, callback) {
    	this.server.collection('visits', function(err, coll) {
    		var doc = {
    			'id': id,
    			'lat': lat,
    			'lon': long
    		}
    		coll.insert(doc, function(err, doc) {
    			callback(true);
    		});
    	});
    }
};