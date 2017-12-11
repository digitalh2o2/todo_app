const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const hbs = require('hbs');
const app = express();
var Handlebars     = require('handlebars');
var HandlebarsIntl = require('handlebars-intl');
const _ = require('lodash');

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
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/todos', (req, res) => {
  Todo.find({})
    .then((todos) => {
      res.render('todos.hbs', {todos});
    }).catch((e) => {
      res.status(400).send('Can not find todos');
    });
});

app.post('/todos', (req, res) => {
  var myTodo = new Todo({
    title: req.body.title,
    todoinfo: req.body.todoinfo
  });

  myTodo.save()
    .then((todo) => {
      res.redirect('/');
    }).catch((e) => {
      res.status(400).send('Unable to save to database');
    });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById({
    _id: id
    })
    .then((todo) => {
      res.render('todo.hbs', {todo});
    }).catch((e) => {
      res.status(400).send('Unable to find todo');
    });
});

app.get('/todo/:id/update', (req, res) => {
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

app.delete('/todos/:id/delete', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove({
    _id: id
  })
    .then((todo) => {
      res.send('Todo removed.')
    }).catch((e) => {
      res.status(400).send('Unable to delete');
    });
});

app.put('/todos/:id', (req, res) => {
  var id = req.params.id
  var body = _.pick(req.body, ['title', 'todoinfo'])
  console.log(body)

  Todo.findOneAndUpdate({
    _id: id
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
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user)
    }).catch((e) => {
      res.status(400).send(e)
    });

});

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.render('users.hbs', {users})
    }).catch((e) => {
      res.status(400).send('An error has occurred!')
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
    .then((token) => {
      res.header('x-auth', token).send(user)
    });
  }).catch((e) => {
      res.status(400).send();
    });
});

app.listen(port, () => {
  console.log(`Successfully listening on port ${port}`)
});
