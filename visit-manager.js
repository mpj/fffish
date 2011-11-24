exports.VisitManager = function (server) {
    this.server = server;
};
exports.VisitManager.prototype = {
    save: function (id, lat, long, callback) {
    	this.server.collection('visits', function(err, coll) {
    		coll.insert(id, lat, long, function(err, doc) {
    			callback(true);
    		});
    	});
    }
};