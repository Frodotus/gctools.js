
/**
 * Module dependencies.
 */
console.log("Key:"+process.env.CONSUMERKEY);
var express = require('express')
  , routes = require('./routes');
var OAuth = require('oauth').OAuth;

var app = module.exports = express();

var oa = new OAuth(
  "https://staging.geocaching.com/OAuth/oauth.ashx",
  "https://staging.geocaching.com/OAuth/oauth.ashx",
  process.env.CONSUMERKEY,
  process.env.CONSUMERSECRET,
  "1.0",
  "http://localhost:3000/auth/geocaching/callback",
  "HMAC-SHA1",
  32,
  { "Accept": "text/json", "Connection": "close", "User-Agent": "Node authentication" }
);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
  });
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
app.get('/profile', routes.profile);


app.get('/auth/geocaching', function(req, res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
      res.send("yeah no. didn't work.")
    }
    else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('https://staging.geocaching.com/OAuth/oauth.ashx?oauth_token='+oauth_token)
  }
  });
});

app.get('/auth/geocaching/callback', function(req, res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  console.log(">>"+req.session.oauth.token);
  console.log(">>"+req.session.oauth.token_secret);
  console.log(">>"+req.query.oauth_token);
  console.log(">>"+req.query.oauth_verifier);

  oa.getOAuthAccessToken(req.session.oauth.token, req.session.oauth.token_secret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : ", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      res.cookie('at', oauthAccessToken);
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      res.cookie('ats', oauthAccessTokenSecret);
  console.log("a>>"+req.session.oauthAccessToken);
  console.log("as>>"+req.session.oauthAccessTokenSecret);

  body = {
    "AccessToken":req.session.oauthAccessToken,
    "ProfileOptions":{
      "ChallengesData":false,
      "FavoritePointsData":false,
      "GeocacheData":false,
      "PublicProfileData":false,
      "SouvenirData":false,
      "TrackableData":false
    },
  "DeviceInfo":{
    "ApplicationCurrentMemoryUsage":1024,
    "ApplicationPeakMemoryUsage":512,
    "ApplicationSoftwareVersion":"0.1",
    "DeviceManufacturer":"Apple",
    "DeviceName":"Apple mbp",
    "DeviceOperatingSystem":"Node",
    "DeviceTotalMemoryInMB":4096,
    "DeviceUniqueId":"3298749873948",
    "MobileHardwareVersion":"0.1",
    "WebBrowserVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11"
  }
  };
      console.log(JSON.stringify(body))
      oa.post("https://staging.api.groundspeak.com/Live/V6Beta/geocaching.svc/GetYourUserProfile?format=Json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, JSON.stringify(body), "text/json", function (error, json, response) {
        if (error) {
          console.log(error)
          res.send("Error logging in : ", 500);
        } else {
          data = JSON.parse(json);
          req.session.profile = data.Profile.User;          
          res.redirect('/profile')
        }  
      });
    }
  });

app.get('/users', function(req, res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  body = {
    "AccessToken":req.cookies.at,
    "ProfileOptions":{
      "ChallengesData":false,
      "FavoritePointsData":false,
      "GeocacheData":false,
      "PublicProfileData":false,
      "SouvenirData":false,
      "TrackableData":false
    },
  "DeviceInfo":{
    "ApplicationCurrentMemoryUsage":1024,
    "ApplicationPeakMemoryUsage":512,
    "ApplicationSoftwareVersion":"0.1",
    "DeviceManufacturer":"Apple",
    "DeviceName":"Apple mbp",
    "DeviceOperatingSystem":"Node",
    "DeviceTotalMemoryInMB":4096,
    "DeviceUniqueId":"3298749873948",
    "MobileHardwareVersion":"0.1",
    "WebBrowserVersion":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11"
  }
  };
      console.log(JSON.stringify(body))
      oa.post("https://staging.api.groundspeak.com/Live/V6Beta/geocaching.svc/GetYourUserProfile?format=Json", req.cookies.at, req.cookies.ats, JSON.stringify(body), "text/json", function (error, json, response) {
        if (error) {
          console.log(error)
          res.send("Error getting geocaching username : ", 500);
        } else {
          console.log(json);
          data = JSON.parse(json);
          //req.session.twitterScreenName = data["screen_name"];    
          res.send(data.Profile.User.UserName);
        }  
      });  

});


//  var url = '';
//  var request = oa.get(url, req.session.oauth.token, req.session.oauth.token_secret, function(error, data) {
//    if (error) {
//      console.log(error);
//    } else {
//      var calendars = JSON.parse(data).data.items;
//      for (var i = 0; i < calendars.length; ++i) {
//        console.log(calendars[i].title);
//      }
//    }
//  });
//  res.send('You are signed in: ');
});

app.get('/awesome', function(req, res) {
 res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
 if(req.session.lastPage) {
   res.send('Last page was: ' + req.session.lastPage + '. ');
 } else {
 req.session.lastPage = '/awesome';
 res.send('Your Awesome.');
}
});

app.listen(process.env.PORT || 3000, function(){
  console.log("express-bootstrap app running");
});
