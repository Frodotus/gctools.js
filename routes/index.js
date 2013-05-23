
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'GCTools' })
};

exports.bruteforcer = function(req, res){
  res.render('bruteforcer', { title: 'GCTools - Bruteforcer', active: 'bruteforcer' })
};
