/*
 * GET home page.
 */
exports.friends_nearby = require('./friends_nearby').friends_nearby;
exports.visits_create = require('./visits').visits_create;
exports.push_tokens_set = require('./push_tokens').push_tokens_set;

exports.index = function(req, res) {
  res.render('index', { title: 'Express', layout: false });
};