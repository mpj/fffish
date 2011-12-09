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
    for(var i=0;i<nearby_friends.length;i++) {
      var fd = nearby_friends[i];
      
      // Round up to nearest thousand
      fd.distance = Math.floor((fd.distance / 1000) + 0.999)*1000;
    }

    res.send({ nearby_friends: nearby_friends });
  });
  
}

