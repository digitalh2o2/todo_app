var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/SecondTodo', {
  useMongoClient: true
});

module.exports = {mongoose};
