var withDistancesOfFriends = require('../lib/visits_helpers').withDistancesOfFriends;



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

  withDistancesOfFriends(token, [ lon, lat ], function(err, nearby_friends){
    res.send({ nearby_friends: nearby_friends });
  });
  
}

