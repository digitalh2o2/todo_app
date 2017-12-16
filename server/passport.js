var {User} = require('./../models/user');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, done){
    User.findOne({ email }, function(err, user) {
      if(err) { return done(err); }

      if(!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      bcrypt.compare(password, user.password, (err, isValid) => {
        if(err){
          return done(err)
        }
        if(!isValid) {
          return done(null, false)
        }
        return done(null, user);
      })
    });
  }
));


module.exports = {passport}
