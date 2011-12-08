
var fb = require('../lib/facebook_helpers');
var token = require('../lib/token_helpers');

exports.push_tokens_set = function(req, res) {  

  var fb_token    = req.param('fb_token'),
      apns_token  = req.param('apns_token');

  
  fb.withMe(fb_token, function(err, me) {
    console.log('inserting',me['id'], apns_token);
    token.insertToken(me['id'], apns_token, function(err, result) {
      res.send("OK");
    });
  });

}

