
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
  
  fb.withFriendIds(token, function(friend_ids) {
    
    // Create a geoindex on loc property
    mongo.withCollection('visits',function(coll) {
      console.log('withCollection callback');
      coll.ensureIndex( { loc: '2d', facebook_id: 1 }, {}, function(error, result) {
        console.log('ensureIndex callback');
        if (error) {
          console.log("Error ensuring index", error);
        } else {
          console.log("Successfully ensured index", result);

          mongo.withServer(function(db) {

            console.log("Trying to find", myLocation);

            // 111 km = approx 1 lat/long unit
            var kilometer_in_lat_long_units = 1 / 111;

            db.executeDbCommand( 
              { 
                geoNear : 'visits', 
                near : myLocation, 

                //query : { facebook_id: { $in : friend_ids } },
                num: 10
              },
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

                var results = first_document.results;

                console.log("executeDbCommand results: ", results);
                res.send(results);
              }
            );
          });
        }
      });
    });
    
  });

};
