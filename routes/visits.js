var request = require('request'),
    url     = require('url'),
    http    = require('http');


exports.visits_post = function(req, res){



  request(
    {uri: someUri}, function (error, response, body) {
      console.log("Fetched " +someUri+ " OK!");
      callback(body);
  });


  UserManager.findByToken(TOKEN, function(current_user) {
    FacebookManager.getFriendIds(current_user.facebook_token, function(facebook_ids) {
      UserManager.findNearby({ 
        loc: [123, 456], 
        radius_meters: 1000,
        facebook_ids: facebook_ids,
      }, function(nearby_friends) {
          var push_token = ;
          NotifyManager.notify("At least one friend is nearby!"
                            , current_user.push_token);
      });
  });

  // Extract actual user_ids from the facebook user ids
  // TODO: Make a query for these in the DB that are near.
  // Probably need a UserManager here...
  // 111 km = approx 1 lat/long unit

    // TODO: Use neoGear instead of find, because
    // it returns the distance too.
    coll.find({ 
      loc: { $near: [lat,lon], $maxDistance: 5 },
      id: id

    })
  */
  res.render('index', { title: 'Express', layout: false })
};