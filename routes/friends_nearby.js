var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

var withFriendIds = require('../lib/with_friend_ids').withFriendIds;

exports.friends_nearby = function(req, res) {  

  // TODO: get these from request
  var token = "AAAEoXGwzDgoBAH08AT7aEiWsizZCnFvnTyLwCfe1o5uh0qcajYgZAkivMpN6WAicLRIyJqMNxGPdlHFxDhmU0ZBHZA6But12IHadnBpgHgZDZD";
  var myLocation = [ 59.35900833063486, 18.04779052734375 ];
  
  withFriendIds(token, function(friend_ids) {
    
    // Create a geoindex on loc property
    withPeopleCollection(function(coll) {
      coll.ensureIndex( { loc: '2d', id: 1 }, function() {} );
    });
    withServer(function(db) {

      // 111 km = approx 1 lat/long unit
      var kilometer_in_lat_long_units = 1 / 111;

      db.executeDbCommand( 
        { 
          geoNear : "people", 
          near : myLocation, 
          maxDistance: 0.8 * kilometer_in_lat_long_units, 
          query : { facebook_id: { $in : friend_ids } },
          num: 10
        },
        {},
        function(err, result) {
          console.log("yay, result", result);
          res.send(result);
        }
      );
    });
  });

};


function withServer(callback) {
  var db = new Db('fffish-development', 
    new Server('localhost', 27017, { auto_reconnect: true }, {}));
  var error_callback = function(){};
  db.open(error_callback);
  callback(db); 
}

function withPeopleCollection(callback) {
  withServer(function(db) {
    db.collection('people', function(err, coll) {
      callback(coll);
    });
  });
}
