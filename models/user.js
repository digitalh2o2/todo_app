const mongoose = require('mongoose');
const validator = require('validator');

const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {ObjectID} = require('mongodb');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email!'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};


UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;
debugger
  return User.findOne({email})
    .then((user) => {
      if(!user){
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if(res){
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};

UserSchema.pre('save', function(next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
