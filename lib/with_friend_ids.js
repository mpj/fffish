var https = require('https');
exports.withFriendIds = function(token, callback) {
  // Request the friends
  // TODO: Cache response MEMcache w/ token as key
  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: '/me/friends?access_token=' + token,
    method: 'GET',
    headers: {
      'Connection': 'close'
    }
  };

  var response_body = "";
  https.get(options, function(resp){
    resp.on('data', function(chunk){
      
      response_body += chunk;
      var response_json;
      try {
        response_json = JSON.parse(response_body);
      }
      catch (e) {
        console.log("waiting for more data chunks...");
        return;
      }

      if (response_json.error) {
        console.log("Facebook API error:", response_json.error);
        return;
      }
      // Facebook will return a JSON object with a data property
      // containing an array of friend objects, with properties
      // 'name' and 'id'. 
      var friends = response_json.data;

      // Construct an array of just the IDs
      var friend_ids = [];
      for(var i=0;i<friends.length;i++) {
        friend_ids.push(friends[i]['id']);
      };

      callback(friend_ids);
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });
}
