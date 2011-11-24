

function simpleCompare(objA, objB) {
	return JSON.stringify(objA) == JSON.stringify(objB);
}

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
	insert: function(doc, callback) {
		this.doc_inserted_last 	= doc;
		callback(null, doc);
    },
    insert_called: function(doc) {
    	return simpleCompare(doc, this.doc_inserted_last);
	},
	ensureIndex: function(index) {
		this.ensure_index_called_with = index;
	},
	ensure_index_called: function(index) {
		return simpleCompare(index, this.ensure_index_called_with);
	}

};