require('rootpath')();
var express = require('express')
  , util = require('util')
  , http = require('http')
  , path = require('path')
  , subdomains = require('express-subdomains')
  , app = exports.app = express()
   , config = exports.config = require('config/' + app.get('env') + '.json')

  // Logging
  , err = require("utils/err")
  //, err = require("utils/logger")

  // Cluster / Db Setup
  , cluster = exports.cluster = require('utils/cluster')
  , db = exports.db = require('db/db')

  // Authentication
  , passport = require('passport')

  // Redis Sessions
  , RedisStore = require('connect-redis')(express);

// define api subdomain
subdomains
  .use('api')


app.set('port', config.port || 3001);
app.use(subdomains.middleware);
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    db: 2
  }),
  secret: '1234567890QWERTY'
}));
app.use(passport.initialize());
app.configure(function() {
  app.use(express.static(path.join(__dirname, 'client/public')));
  app.use(app.router);
});

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
 var  server = require('http').createServer(app).listen(app.get("port"))
  , io = exports.io = require('socket.io').listen(server);


// Passport configuration
require('./auth');

var currentToken = '123412341234';
app.post('/login', passport.authenticate('local'), function(req, res){
  req.session.account = req.user;
  res.send({
      success: true,
      message: "Authenticated",
      token: currentToken,
      account: req.user
  });
});

// create a new account
app.post('/signup', function(req, res){
    db.account.save(req.body, function(err, result){
        if(err){
        console.log(err)
            res.status(500).send({error:err});
        }
        else{

          db.account.getById(result.generated_keys[0], function(err, user){
            if(err){
              console.log(err);
              res.status(500).send({error:err});
            }
            else{
              req.session.account = user;
              res.send({
                  success: true,
                  message: "Authenticated",
                  token: currentToken,
                  account: user
              });
            }
          });
        }
    })
});


var connectedAccounts = exports.connectedAccounts =  [];
io.sockets.on('connection', function (socket) {

  socket.on('adduser', function(account_id){
    socket.account_id = account_id;
    connectedAccounts[account_id] = socket.id;
  });

  socket.on('disconnect', function(){
    delete connectedAccounts[socket.account_id];
  });
});

//load all the routes int he endpoints directory
require("fs").readdirSync(__dirname + "/endpoints").forEach(function(file) {
  if(file.indexOf(".js") != -1) require("./endpoints/" + file);
});

app.get("/api/v1", function(req, res){
    res.send({api:true})
})
console.log("Next Gen Server listening on port:" + app.get("port"));
app.get('*', function (req, res) { res.sendfile(path.join(__dirname, 'client/public/dist/index.html')); });
