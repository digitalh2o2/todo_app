require('./server/config.js');
require('./server/passport.js');

const express = require('express');
const flash = require('connect-flash')
const session = require('express-session');
const bodyParser = require('body-parser');
const moment = require('moment');
const hbs = require('hbs');
const app = express();
var passport = require('passport')
LocalStrategy = require('passport-local').Strategy;
var Handlebars     = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
HandlebarsIntl.registerWith(hbs);

const port = process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static(__dirname + '/node_modules/bulma/css/'));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: true,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/',(req, res) => {
  res.render('index.hbs', {user: req.user});
});

app.get('/todos/create',
  require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  res.render('new_todo.hbs', {user: req.user});
});

app.get('/todos',
require('connect-ensure-login').ensureLoggedIn(),
(req, res) => {
  Todo.find({
    _author: req.user._id
  })
    .then((todos) => {
      res.render('todos.hbs', {todos});
    }).catch((e) => {
      res.status(400).send('Can not find todos');
    });
});

app.get('/user/profile',
require('connect-ensure-login').ensureLoggedIn(),
(req, res) => {
  res.render('profile.hbs', {user: req.user})
})

app.post('/todos',
require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  var myTodo = new Todo({
    title: req.body.title,
    todoinfo: req.body.todoinfo,
    _author: req.user._id
  });

  myTodo.save()
    .then((todo) => {
      res.redirect('/todos');
    }).catch((e) => {
      res.status(400).send(e);
    });
});

app.get('/todos/:id',
  require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _author: req.user._id
    })
    .then((todo) => {
      res.render('todo.hbs', {todo});
    }).catch((e) => {
      res.status(400).send('Unable to find todo');
    });
});

app.get('/todo/:id/update',
  require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById({
    _id: id
  })
    .then((todo) => {
      res.render('update.hbs', {todo})
    }).catch((e) => {
      res.status(400).send('Unable to find todo');
    })
});

app.delete('/todos/:id/delete',(req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id
  })
    .then((todo) => {
      res.send('Todo removed.')
    }).catch((e) => {
      res.status(400).send('Unable to delete');
    });
});

app.put('/todos/:id',(req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ['title', 'todoinfo'])

  Todo.findOneAndUpdate({
    _id: id,
  }, {$set: body}, {new: true})
    .then((todo) => {
      if(!todo){
        res.status(400).send('Can\'t find todo');
      }
      console.log('made it')
      res.send({todo})
    }).catch((e) => {
      res.status(400).send('Unable to update');
    })
});

app.post('/user/complete', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)

  user.save()
    .then(() => {
      res.redirect('/users/login');
    }).catch((e) => {
      res.status(400).send(e)
    });

});

app.get('/user/new', (req, res) => {
  res.render('new_user.hbs')
});

app.get('/users/login', (req, res) => {
  res.render('login.hbs')
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.post('/users/login', passport.authenticate('local',
  {
    failureRedirect: '/users/login',
    failureFlash: true
  }), function(req, res) {
    res.redirect('/todos')
  }
);

app.listen(port, () => {
  console.log(`Successfully listening on port ${port}`)
});
