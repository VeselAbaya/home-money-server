require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('./db/mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('./db/models/user');
const Bill = require('./db/models/bill');
const authenticate = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Welcome to my Home-money API')
});

app.get('/bill', authenticate, (req, res) => {
  Bill.findOne({_userId: req.user._id}).then(bill => {
    res.send({bill})
  }).catch(err => {
    res.status(400).send(err)
  })
});

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

app.post('/bill', authenticate, (req, res) => {
  const bill = new Bill({
    value: req.body.value,
    currency: req.body.currency,
    _userId: req.user._id
  });

  bill.save().then(doc => {
    res.send(doc);
  }).catch(err => {
    res.status(400).send(err);
  })
});

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
      // create bill for user
      const bill = new Bill({_userId: user._id});
      bill.save();

      res.header({
        'Access-Control-Expose-Headers': 'X-Auth',
        'X-Auth': token
      }).send(user)
    }).catch(err => {
      res.status(400).send({err})
    })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send({
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name
  })
});

app.get('/users/email-exists/:email', (req, res) => {
  const email = req.params.email;
  User.findOne({email})
    .then(user => {
      res.send(user ? true : false);
    });
});

app.post('/users/login', cors(), (req, res) => {
  const {email, password} = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(email, password).then(user => {
    user.generateAuthToken().then(token => {
      res.header({
        'Access-Control-Expose-Headers': 'X-Auth',
        'X-Auth': token
      }).send(user)
    })
  }).catch(err => {
    if (err === 'Wrong credentials') {
      res.status(403).send();
    }
    else {
      res.status(400).send();
    }
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
  console.log(`Home-money server started up on port ${port}`)
});

module.exports = app;

// signup (hash password and generate token)
// *login (bcrypt.compare(password, hash_password) and generate token)
// for every private route: authenticate user by check it's token is valid
