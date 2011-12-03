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
  var host;
  var port;
  var database_name;
  if (process.env.NODE_ENV == "production") {
    host = 'staff.mongohq.com';
    port = 10089;
    database_name = 'app1930135';
  } else {
    host = 'localhost';
    port = 27017;
    database_name = 'fffish-development';
  }

  var server = new Server(host, port, { auto_reconnect: true }, {});
  var db = new Db(database_name, server);
  db.open(function(err, p_client) {
    if (err) console.log("open error:", err);
    if (process.env.NODE_ENV == "production") {
      db.authenticate('heroku', 'warpninjap', function(err) {
        //Change error handler when going into production 
        if ("auth error:", err) console.log(err);
        callback(db); 
      });
    } else{
      callback(db); 
    }
  });

   
}