var mongoose = require('mongoose');
var validator = require('validator');
var {ObjectID} = require('mongodb');

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

var User = mongoose.model('User', UserSchema);

module.exports = {User};
