var https = require('https');

exports.withFriendIds = function(token, callback) {
  getPath('/me/friends', token, function(err,response_json) {
    
    // FB returns an array of friend objects, 
    // with properties 'name' and 'id'. 
    var friends = response_json.data;

    // Construct an array of just the IDs
    var friend_ids = [];
    for(var i=0;i<friends.length;i++) {
      friend_ids.push(Number(friends[i]['id']));
    }

    callback(friend_ids);
  });
}

exports.withMe = function(token, callback) {
  console.log('withMe entered.');
  getPath('/me', token, function(err,response_json) {
    callback(err, response_json);
    // Example output:
    /*{
       "id": "640798226",
       "name": "Mattias Petter Johansson",
       "first_name": "Mattias",
       "middle_name": "Petter",
       "last_name": "Johansson",
       "link": "http://www.facebook.com/mattias.johansson",
       "username": "mattias.johansson",
       "bio": "Loves:  Internet, coding, business, video production, \nvideo games blahbahahah.",
       "gender": "male",
       "email": "mpj\u0040mpj.me",
       "timezone": 1,
       "locale": "en_US",
       "verified": true,
       "updated_time": "2011-11-24T15:56:56+0000"
    }*/
  });
}

exports.withUser = function(token, user_id, callback) {
  getPath('/'+user_id, token, function(err, response_json) {
    console.log("withUser worked, returning: ", response_json);
    callback(null, response_json);
  });
}

function getPath(path, token, callback) {

  // TODO: Cache response MEMcache w/ token as key
  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: path + '?access_token=' + token,
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
        console.log("Receiving response ...");
        return;
      }

      if (response_json.error) {
        console.log("Facebook API error:", response_json.error);
        callback(response_json.error, null);
      } else {
        console.log("Received complete response.");
        // Facebook will return a JSON object with a data property
        // as the result.
        callback(null, response_json);
      }
  
    });
  }).on("error", function(e){
    console.log("Got response error: " + e.message);
  });
}
