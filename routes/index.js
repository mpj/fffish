/*
 * GET home page.
 */
exports.friends_nearby = require('./friends_nearby').friends_nearby;
exports.visits_create = require('./visits').visits_create;

exports.index = function(req, res) {
  res.render('index', { title: 'Express', layout: false });
};