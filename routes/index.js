/*
 * GET home page.
 */
exports.friends_nearby = require('./friends_nearby').friends_nearby;

exports.index = function(req, res) {
  res.render('index', { title: 'Express', layout: false });
};