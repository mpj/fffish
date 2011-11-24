


exports.MockServer = function () {

};

exports.MockServer.prototype = {
    collection: function(name, callback) {
    	var error 	= null;
    	this.current_collection 	
    		= new exports.MockCollection(name);
    	callback(error, this.current_collection);
    },
    collection_called: function(name) {
    	return 	this.current_collection && 
    			this.current_collection.name == name;
    }
};


exports.MockCollection = function(name) {
	this.name = name;
};

exports.MockCollection.prototype = {
	insert: function(id, lat, long, callback) {
		this.id_inserted 	= id;
		this.lat_inserted 	= lat;
		this.long_inserted 	= long;
		callback(null, { id: id, lat: lat, long: long });
    },
    insert_called: function(id, latitude, longitude) {
		return (
			this.id_inserted == id &&
			this.lat_inserted == latitude && 
			this.long_inserted == longitude);
	}
};