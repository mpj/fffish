
/**
 * Module dependencies.
 */

var express = require('express')
  , routes 	= require('./routes')
  , ejs 	= require('ejs');

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = 'development'

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.post('/visits', routes.visits_create);
app.get('/nearby', routes.friends_nearby);
app.post('/push_tokens_set', routes.push_tokens_set);

var port = process.env.PORT || 3000;

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
