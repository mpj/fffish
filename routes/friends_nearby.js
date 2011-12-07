var fb = require('../lib/facebook_helpers');
var mongo = require('../lib/mongo_helpers');
var withCollection = require('../lib/mongo_helpers').withCollection;

exports.friends_nearby = function(req, res) {  

  var token = req.param('fb_token'),
      lat   = parseFloat(req.param('lat')),
      lon   = parseFloat(req.param('lon'));

  if (isNaN(lat)) {
    res.send("lat was not in a correct format");
    return;
  }
  if (isNaN(lon)) {
    res.send("lon was not in a correct format");
    return;
  }
    
  var myLocation = [ lat, lon ];

  // Do this while withFriendIds is running.
  mongo.ensureIndex('visits', { loc: '2d', ts: 1, facebook_id: 1 }, function(){});
  
  fb.withFriendIds(token, function(friend_ids) {
    withVisitsNearLocation(myLocation, friend_ids, function(visits) {

      // 111 km = approx 1 lat/long unit
      var km_in_lat_long_units = 1.0 / 111.05;

      // Create a hash of facebook ids mapped
      // to distance.
      var dist_map = {};
      for (var i=0;i<visits.length;i++) {
        var row = visits[i];
        var fb_id = row.obj.facebook_id;

        var distance_km = parseFloat(row.dis) * km_in_lat_long_units;
        distance_meters = Math.floor(distance_meters * 1000);
        // Only assign the first, we are sorting by
        // ts in the query.
        if (!dist_map[fb_id])
          dist_map[fb_id] = distance_meters;
      }

      // Construct an array of the hash
      var nearby_friends = [];
      for(key in dist_map)
      {
        nearby_friends.push({
            distance: dist_map[key]    
          , facebook_id: key 
        });
      }
      
      res.send({ nearby_friends: nearby_friends });
    });
  });
}



function withVisitsNearLocation(location, friend_ids, callback) {
  mongo.withServer(function(db) {

    // TODO: Doing it like this won't work as the dataset grows,
    // the returning function would return to big of a set.
    // Map reduce or prune data.

    console.log("Executing withVisitsNearLocation with");

    var queryopts = { 
        geoNear : 'visits', 
        near : location, 
        query : { facebook_id: { $in : friend_ids } },
        sort : { ts: -1 }
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