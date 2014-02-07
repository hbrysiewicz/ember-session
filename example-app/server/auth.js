var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('db/db');

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.account.getByEmail(username, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.password == password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  db.account.getOne(email, function (err, user) {
    done(err, user);
  });
});

