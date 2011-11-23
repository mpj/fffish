exports.VisitManager = function (server) {
    this.server = server;
};
exports.VisitManager.prototype = {
    save: function (id, lat, long, callback) {
    	this.server.store(id, lat, long);
    	callback(true);
    }
};