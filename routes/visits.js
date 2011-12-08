var mongo   = require('../lib/mongo_helpers'),
    withDistancesOfFriends = require('../lib/visits_helpers').withDistancesOfFriends;
var fb = require('../lib/facebook_helpers');
var apns = require('apn');
var sys = require("sys"),  
  http = require("http"),  
  path = require("path"),  
  url = require("url"),  
  filesys = require("fs");  

exports.visits_create = function(req, res){

  var facebook_token =  req.param('fb_token'),
      lat =             parseFloat(req.param('lat')),
      lon =             parseFloat(req.param('lon'));

  if (isNaN(lat)) {
    res.send("lat was not in a correct format");
    return;
  }
  if (isNaN(lon)) {
    res.send("lon was not in a correct format");
    return;
  } 

  fb.withMe(facebook_token, function(err, me) {
    if (err) {
      res.send(err);
      return;
    }
    createVisit(Number(me['id']), lon, lat, function(visit) {
      
      res.send('OK');

      withDistancesOfFriends(facebook_token, [lon, lat], function(err, friends_distance) {
        console.log('withDistancesOfFriends returned', friends_distance);
        for(var i=0;i<friends_distance.length;i++) {
          var fd = friends_distance[i];
          if (fd.distance < 5000) {
            console.log('Found frieind', fd);
            fb.withUser(facebook_token, fd.facebook_id, function(err, friend) {

              console.log('Looked up friend', friend);
              var apns_token = "381576c9863c1c5f2ec39bffbb64e529f1e45cfc0480d6dfa28ed3e4bb7896a0";
              options =   { 
                cert: path.join(process.cwd(),'certificates/apns-dev-cert.pem') /* Certificate file */
                , key:  path.join(process.cwd(),'certificates/apns-dev-key.pem')  /* Key file */
                , gateway: 'gateway.sandbox.push.apple.com' /* gateway address */
                , port: 2195 /* gateway port */
                , enhanced: true /* enable enhanced format */
                , errorCallback: 
                    function(error_code, obj) { 
                      console.log("Apple returned error: ", error_code, "obj sent:", obj);
                    } /* Callback when error occurs */
                , cacheLength: 5 /* Notifications to cache for error purposes */
                };
                var apnsConnection = new apns.connection(options);
                var myDevice = new apns.device(apns_token);

                var note = new apns.notification();

                note.badge = 1;
                note.alert = friend['name'] + " is nearby.";
                note.device = myDevice;

                apnsConnection.sendNotification(note);
                // createVisit

                console.log('Sent notification');
            });
            break;
          } 
        }
      });
      
    });
  });

  

};

function createVisit(facebook_id, lon, lat, callback) {
  console.log("createVisit entered.");
  var now = new Date().getTime();
  var visit = { facebook_id: facebook_id, 
                loc: [ lon, lat ],
                ts: now }
  mongo.withCollection('visits', function(visits) {
    visits.insert(visit, function(err, result) {
      if (err) {
        console.log("createVisit error:", err);
      } else {
        console.log("insert succeeded, returning", result);
        callback(result); 
      }
    });
  });
}