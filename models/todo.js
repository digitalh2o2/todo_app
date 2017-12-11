var mongoose = require('mongoose');
var {ObjectID} = require('mongodb');

var TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  todoinfo: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }

});


var Todo = mongoose.model('Todo', TodoSchema);

module.exports = {Todo};
