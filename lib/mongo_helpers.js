var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID;

exports.ensureIndex = function(collection_name, index, callback) {
  console.log("Ensuring index", index, "on", collection_name);
  exports.withCollection(collection_name, function(coll) {
    coll.ensureIndex( index, {}, function(error, result) {
      if (error) {
        console.log("Error ensuring index:", error);
      } else {
        console.log("Successfully ensured index: ", result);
      }
      callback();
    });
  });    
}

exports.withCollection = function(name, callback) {
 exports.withServer(function(db) {
    db.collection(name, function(err, coll) {
      if (err)
        console.log("withCollection error:", err);
      else
        callback(coll);
    });
  });
}

exports.withServer = function(callback) {
  var server = new Server('localhost', 27017, { auto_reconnect: true }, {});
  var db = new Db('fffish-development', server);
  db.open(function() {});
  callback(db); 
}