const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

// const Todo = require('../../db/models/todo');
const User = require('../../db/models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [
  {
    _id: userOneId,
    email: 'Vandervise465@gmail.com',
    password: '75onetih',
    name: 'Антай',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'k.r@example.com',
    password: 'pirozhok',
    name: 'Екатерина',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
      }
    ]
  }
];

// const todos = [
//   {
//     _id: new ObjectId(),
//     text: 'first test todo',
//     _creator: userOneId
//   },
//   {
//     _id: new ObjectId(),
//     text: 'second test todo',
//     _creator: userTwoId
//   }
// ];
//
// const populateTodos = done => {
//   Todo.deleteMany({}).then(() => {
//     return Todo.insertMany(todos)
//   }).then(() => done())
// };

const populateUsers = done => {
  User.deleteMany({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done())
};

module.exports = {/*todos, populateTodos,*/ users, populateUsers};
