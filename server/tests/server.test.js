const request = require('supertest');
const expect = require('expect');
const {ObjectId} = require('mongodb');

const app = require('../server');
// const Todo = require('../db/models/todo');
const User = require('../db/models/user');
const {/*todos, populateTodos,*/ users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
// beforeEach(populateTodos);

// describe('GET /todos', () => {
//   it('should get all todos', done => {
//     request(app)
//       .get('/todos')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .expect(res => {
//         expect(res.body.todos.length).toBe(1)
//       })
//       .end(done)
//   })
// });
//
// describe('POST /todos', () => {
//   it('should create a new todo', done => {
//     const text = 'Test todo text';
//     request(app)
//       .post('/todos')
//       .set('x-auth', users[0].tokens[0].token)
//       .send({text})
//       .expect(200)
//       .expect(res => {
//         expect(res.body.text).toBe(text)
//       })
//       .end((err, res) => {
//         if (err)
//           return done(err);
//
//         Todo.find({text}).then(todos => {
//           expect(todos.length).toBe(1);
//           expect(todos[0].text).toBe(text);
//           done()
//         }).catch(err => done(err))
//       })
//   });
//
//   it('should not create todo with invalid body data', done => {
//     request(app)
//       .post('/todos')
//       .set('x-auth', users[0].tokens[0].token)
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err)
//           return done(err);
//
//         Todo.find().then(todos => {
//           expect(todos.length).toBe(2);
//           done()
//         }).catch(err => done(err))
//       })
//   })
// });
//
// describe('GET /todos/:id', () => {
//   it('should create a new todo', done => {
//     request(app)
//       .get(`/todos/${todos[0]._id.toHexString()}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .expect(res => {
//         expect(res.body.todo.text).toBe('first test todo')
//       })
//       .end(done)
//   });
//
//   it('should return 404 if todo not found', done => {
//     request(app)
//       .get(`/todos/${new ObjectId().toHexString()}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(404)
//       .end(done)
//   });
//
//   it('should return 400 if ID is invalid', done => {
//     request(app)
//       .get('/todos/dfeg245dfh4')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(400)
//       .end(done)
//   })
// });
//
// describe('DELETE /todos/:id', () => {
//   it('should remove todo', done => {
//     const hexId = todos[1]._id.toHexString();
//
//     request(app)
//       .delete(`/todos/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .expect(200)
//       .expect(res => {
//         expect(res.body.todo.text).toBe('second test todo')
//       })
//       .end((err, res) => {
//         if (err)
//           return done(err);
//
//         Todo.findById(hexId).then(todo => {
//           expect(todo).toBeNull();
//           done()
//         }).catch(err => done(err))
//       })
//   });
//
//   it('should return 404 if todo not found', done => {
//     request(app)
//       .delete(`/todos/${new ObjectId().toHexString()}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(404)
//       .end(done)
//   });
//
//   it('should return 400 if :id is invalid', done => {
//     request(app)
//       .delete(`/todos/12353wg345`)
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(400)
//       .end(done)
//   })
// });
//
// describe('PATCH /todos/:id', () => {
//   it('should update todo\'s text field', done => {
//     const hexId = todos[0]._id.toHexString();
//     request(app)
//       .patch(`/todos/${hexId}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .send({text: 'PATCH testing'})
//       .expect(200)
//       .expect(res => {
//         expect(res.body.todo.text).toBe('PATCH testing')
//       })
//       .end(done)
//   });
//
//   it('should update todo\'s text field and complete status', done => {
//     const hexId = todos[0]._id.toHexString();
//     request(app)
//       .patch(`/todos/${hexId}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .send({
//         text: 'PATCH testing',
//         completed: true
//       })
//       .expect(200)
//       .expect(res => {
//         expect(res.body.todo.text).toBe('PATCH testing');
//         expect(res.body.todo.completed).toBe(true);
//         expect(res.body.todo.completeAt).toBeTruthy()
//       })
//       .end(done)
//   });
//
//   it('should clear completeAt field if complete updated to false', done => {
//     const hexId = todos[0]._id.toHexString();
//     request(app)
//       .patch(`/todos/${hexId}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .send({
//         completed: false
//       })
//       .expect(200)
//       .expect(res => {
//         expect(res.body.todo.completed).toBe(false);
//         expect(res.body.todo.completeAt).toBeNull()
//       })
//       .end(done)
//   });
//
//   it('should return 404 if todo patching by another user', done => {
//     const hexId = todos[0]._id.toHexString();
//     request(app)
//       .patch(`/todos/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .expect(404)
//       .end(done)
//   });
//
//   it('should return 404 if todo not found', done => {
//     request(app)
//       .patch(`/todos/${new ObjectId().toHexString()}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .send({})
//       .expect(404)
//       .end(done)
//   });
//
//   it('should return 400 if :id is invalid', done => {
//     request(app)
//       .patch(`/todos/12353wg345`)
//       .set('x-auth', users[0].tokens[0].token)
//       .send({})
//       .expect(400)
//       .end(done)
//   })
// });

describe('GET /users/me route', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
});

describe('POST /users route', () => {
  it('should create a user', done => {
    const email = 'example@example.com';
    const password = '123456';
    const name = 'Пример';
    request(app)
      .post('/users')
      .send({email, password, name})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email)
      })
      .end(err => {
        if (err)
          return done(err);

        User.findOne({email}).then(user => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch(err => {
          done(err);
        })
      })
  });

  it('should validation errors if request invalid', done => {
    const email = 'example.com';
    const password = '1234';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('shouldn\'t create user if email in use', done => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: '123456'})
      .expect(400)
      .end(done)
  })
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy()
      })
      .end((err, res) => {
        if (err)
          return done(err);

        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1]).toHaveProperty('token', res.headers['x-auth']);
          expect(user.tokens[1]).toHaveProperty('access', 'auth');
          done()
        }).catch(err => done(err))
      })
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).not.toBeTruthy()
      })
      .end((err, res) => {
        if (err)
          return done(err);

        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).toBe(1);
          done()
        }).catch(err => done(err))
      })
  })
});

describe('DELETE /users/me/token', () => {
  it('should remove token from tokens array', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err)
          return done(err);

        User.findById(users[0]._id).then(user => {
          expect(user.tokens.length).toBe(0);
          done()
        }).catch(err => done(err))
      })
  })
});

describe('GET /users/email-exists', () => {
  it('should find user', done => {
    request(app)
      .get('/users/email-exists/Vandervise465@gmail.com')
      .expect(200, (err, res) => {
        expect(res.body).toBe(true);
        done();
      })
  });

  it('should\'t find user', done => {
    request(app)
      .get('/users/email-exists/notExisting@email.com')
      .expect(200, (err, res) => {
        expect(res.body).toBe(false);
        done();
      })
  })
});
