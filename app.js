
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
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

console.log(routes);
app.get('/', routes.bruteforcer);
app.get('/home', routes.index);
app.get('/bruteforcer', routes.bruteforcer);
app.get('/myfinds', routes.myfinds);

app.listen(process.env.PORT || 3000, function(){
  console.log("express-bootstrap app running");
});
