exports.VisitManager = function (server) {
    server.store();
};
exports.VisitManager.prototype = {
    save: function (callback) {
    	callback(true);
    }
};