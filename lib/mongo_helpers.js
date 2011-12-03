var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID;

exports.withCollection = function(name, callback) {
  withServer(function(db) {
    db.collection(name, function(err, coll) {
      if (err)
        console.log("withCollection error:", err);
      else
        callback(coll);
    });
  });
}

function withServer(callback) {
  var server = new Server('localhost', 27017, { auto_reconnect: true }, {});
  var db = new Db('fffish-development', server);
  db.open(function(error) {
    console.log("could not open db:", error);
  });
  callback(db); 
}