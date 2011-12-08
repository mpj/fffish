var withDistancesOfFriends = require('../lib/facebook_helpers').withDistancesOfFriends;

var earthRadius = 6378; // km

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
    
  var myLocation = [ lon, lat ];

  withDistancesOfFriends(token, function(err, nearby_friends){
    res.send({ nearby_friends: nearby_friends });
  });
  
}

