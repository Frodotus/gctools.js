
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'GCTools', active: 'home' })
};

exports.bruteforcer = function(req, res){
  res.render('bruteforcer', { title: 'GCTools - Bruteforcer', active: 'bruteforcer' })
};

exports.myfinds = function(req, res){
  res.render('myfinds', { title: 'GCTools - MyFinds', active: 'myfinds' })
};
