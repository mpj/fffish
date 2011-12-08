var mongo = require('../lib/mongo_helpers');
var withCollection = require('../lib/mongo_helpers').withCollection;
var fb = require('../lib/facebook_helpers');

var earthRadius = 6378; // km

exports.withDistancesOfFriends = function(fb_token, loc, callback) {
  
  fb.withFriendIds(fb_token, function(friend_ids) {
    withVisitsNearLocation(loc, friend_ids, function(visits) {

      // Create a hash of facebook ids mapped
      // to distance.
      var dist_map = {};
      for (var i=0;i<visits.length;i++) {
        var row = visits[i];
        var fb_id = row.obj.facebook_id;

        console.log("Row ts: " + row.obj.ts); 
        console.log("Row dis: " + row.dis);

        var distance_km = row.dis * earthRadius;
        row.obj.distance_meters = Math.floor(distance_km * 1000);
        
        // Only assign the newest
        if (!dist_map[fb_id] || dist_map[fb_id].ts < row.obj.ts) {
          dist_map[fb_id] = row.obj;
        }
      }

      // Construct an array of the hash
      var nearby_friends = [];
      for(key in dist_map)
      {
        nearby_friends.push({
            distance: dist_map[key].distance_meters    
          , facebook_id: key 
        });
      }
      callback(null, nearby_friends);
    });
  });
}



function withVisitsNearLocation(location, friend_ids, callback) {
  mongo.withServer(function(db) {

    mongo.ensureIndex('visits', 
      { loc: '2d', ts: 1, facebook_id: 1 }, function(){});

    // TODO: Doing it like this won't work as the dataset grows,
    // the returning function would return to big of a set.
    // Map reduce or prune data.

    var range = 10000; // km
    var range_in_radians = range / earthRadius;

    var queryopts = { 
        geoNear : 'visits', 
        spherical: true,
        maxDistance : range_in_radians, 
        near : location, 
        query : { facebook_id: { $in : friend_ids } }
      };
    console.log("queryopts", queryopts);

    db.executeDbCommand( 
      queryopts,
      {},
      function(error, response_body) {
        
        if (error) {
          console.log("executeDbCommand error:", error);
          return;
        }

        var first_document = response_body.documents[0];

        if (first_document.errmsg) {
          var msg = first_document.errmsg;
          var code = first_document.code;
          console.log("executeDbCommand error: " + code + " " + msg );
          return;
        }

        console.log("response_body", response_body);

        var results = first_document.results;

        /*
        results look like this:
        [
           {
              "dis":0,
              "obj":{
                 "facebook_id":"640798226",
                 "loc":[
                    59.35900833063487,
                    18.04779052734375
                 ],
                 "_id":"4eda6bda7dd85d133c000001"
              }
           }
        ]*/
        console.log("Got results, returning ...");
        callback(results);
      }
    );
  });
}