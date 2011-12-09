var mongo   = require('../lib/mongo_helpers');

exports.insertToken = function(facebook_id, apns_token, callback) {
  var token_row = { fb_id: facebook_id, token: apns_token };
  mongo.withCollection('push_tokens', function(push_tokens) {
    push_tokens.insert(token_row, function(err, result) {
      if (err) {
        console.log("insertToken error:", err);
      } else {
        console.log("insertToken success, returning", result);
        callback(null, result); 
      }
    });
  });
}

exports.getToken = function(facebook_id, callback) {
  mongo.withCollection('push_tokens', function(coll) {
    coll.findOne( { fb_id: facebook_id }, function(err, result) {
      if (err){
        console.log("getToken error", err);
        return;
      }
      console.log("getToken result:", result);
      
      var token = null;
      if (result)
        token = result.token;
      callback(null, token); 
    });
  });
}
