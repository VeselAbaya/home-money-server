require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('./db/mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('./db/models/user');
// const Todo = require('./db/models/todo');
const authenticate = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Welcome to my Todo API')
});

// app.get('/todos', authenticate, (req, res) => {
//   Todo.find({_creator: req.user._id}).then(todos => {
//     res.send({todos})
//   }).catch(err => {
//     res.status(400).send(err)
//   })
// });
//
// app.get('/todos/:id', authenticate, (req, res) => {
//   const id = req.params.id;
//   if (ObjectId.isValid(id)) {
//     Todo.findOne({
//       _id: id,
//       _creator: req.user.id
//     }).then(todo => {
//       if (!todo)
//         return res.status(404).send();
//       res.send({todo})
//     })
//   } else {
//     res.status(400).send()
//   }
// });
//
// app.post('/todos', authenticate, (req, res) => {
//   const todo = new Todo({
//     text: req.body.text,
//     _creator: req.user._id
//   });
//
//   todo.save().then(doc => {
//     res.send(doc)
//   }).catch(err => {
//     res.status(400).send(err)
//   })
// });
//
// app.delete('/todos/:id', authenticate, (req, res) => {
//   const id = req.params.id;
//   if (!ObjectId.isValid(id))
//     return res.status(400).send();
//
//   Todo.findOneAndDelete({
//     _id: id,
//     _creator: req.user._id
//   }).then(todo => {
//     if (!todo)
//       return res.status(404).send();
//     res.send({todo})
//   }).catch(err => {
//     res.status(400).send()
//   })
// });
//
// app.patch('/todos/:id', authenticate, (req, res) => {
//   const id = req.params.id;
//   const body = _.pick(req.body, ['text', 'completed']);
//
//   if (!ObjectId.isValid(id))
//     return res.status(400).send();
//
//   if (_.isBoolean(body.completed) && body.completed)
//     body.completeAt = new Date().getTime();
//   else {
//     body.completed = false;
//     body.completeAt = null;
//   }
//
//   Todo.findOneAndUpdate({
//     _id: id,
//     _creator: req.user._id
//   }, {$set: body}, {new: true}).then(todo => {
//     if (!todo)
//       return res.status(404).send();
//     res.send({todo})
//   }).catch(err => {
//     res.status(400).send()
//   })
// });

app.post('/users', cors(), (req, res) => {
  const body = _.pick(req.body, ['email', 'password', 'name']);
  const user = new User(body);

  user.save().then(() => user.generateAuthToken())
    .then(token => {
      res.header('x-goog-authuser', token).send(user);
    }).catch(err => {
      res.status(400).send({err})
    })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
});

app.post('/users/login', (req, res) => {
  const {email, password} = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(email, password).then(user => {
    user.generateAuthToken().then(token => {
      res.header({
        'Access-Control-Allow-Headers': 'X-Auth',
        'X-Auth': token
      }).send(user)
    })
  }).catch(err => {
    res.status(400).send()
  })
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch(err => {
    res.status(400).send()
  })
});

app.listen(port, () => {
  console.log(`Todo server started up on port ${port}`)
});

module.exports = app;

// signup (hash password and generate token)
// *login (bcrypt.compare(password, hash_password) and generate token)
// for every private route: authenticate user by check it's token is valid
