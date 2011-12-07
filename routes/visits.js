var mongo   = require('../lib/mongo_helpers'),
    fb      = require('../lib/facebook_helpers');


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
    createVisit(Number(me['id']), lon,lat function(visit) {
      res.send('OK');
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