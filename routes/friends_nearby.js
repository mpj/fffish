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
    
  //var myLocation = [ 59.35900833063486, 18.04779052734375 ];
  var myLocation = [ lat, lon ];

  // Do this while withFriendIds is running.
  mongo.ensureIndex('visits', { loc: '2d', facebook_id: 1 }, function(){});
  
  fb.withFriendIds(token, function(friend_ids) {
    withVisitsNearLocation(myLocation, friend_ids, function(visits) {
      console.log("Got visits, generating output from", visits.length, "visits");

      var nearby_friends = [];
      for (var i=0;i<visits.length;i++) {
        var row = visits[i];
        var distance_meters = parseFloat(row.dis) * 111 * 1000;
        nearby_friends.push({
            distance:     distance_meters
          , facebook_id:  row.obj.facebook_id
        });
      }
      console.log("Returning nearby friends response ...");
      res.send({ nearby_friends: nearby_friends });
      res.end();
    });
  });
}



function withVisitsNearLocation(location, friend_ids, callback) {
  mongo.withServer(function(db) {

    console.log("Executing withVisitsNearLocation with");
    // 111 km = approx 1 lat/long unit
    var kilometer_in_lat_long_units = 1 / 111;

    var queryopts = { 
        geoNear : 'visits', 
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