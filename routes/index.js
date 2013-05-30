
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'GCTools', active: 'home', profile: req.session.profile  })
};

exports.bruteforcer = function(req, res){
  res.render('bruteforcer', { title: 'GCTools - Bruteforcer', active: 'bruteforcer', profile: req.session.profile  })
};

exports.myfinds = function(req, res){
  res.render('myfinds', { title: 'GCTools - MyFinds', active: 'myfinds', profile: req.session.profile  })
};

exports.profile = function(req, res){
  res.render('profile', { title: 'GCTools - Profile', active: 'profile', profile: req.session.profile })
};
