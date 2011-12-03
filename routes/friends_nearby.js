
var fb = require('../lib/facebook_helpers');
var withCollection = require('../lib/mongo_helpers').withCollection;

exports.friends_nearby = function(req, res) {  

  // TODO: get these from request
  var token = "AAAEoXGwzDgoBAH08AT7aEiWsizZCnFvnTyLwCfe1o5uh0qcajYgZAkivMpN6WAicLRIyJqMNxGPdlHFxDhmU0ZBHZA6But12IHadnBpgHgZDZD";
  var myLocation = [ 59.35900833063486, 18.04779052734375 ];
  
  fb.withFriendIds(token, function(friend_ids) {
    
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
