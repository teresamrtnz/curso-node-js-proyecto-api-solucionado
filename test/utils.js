const { ObjectID } = require('mongodb')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const User = require('../app/models/Usuario')

const users = [
  {
    _id: userOneId,
    email: 'prueba@prueba.com',
    password: 'password1'
  },
  {
    _id: userTwoId,
    email: 'prueba2@prueba.com',
    password: 'password2'
  }
]

const loadUsers = done => {
  User.deleteMany({})
    .then(() => {
      const userOne = new User(users[0]).save()
      const userTwo = new User(users[1]).save()
      return Promise.all([userOne, userTwo])
    })
    .then(() => done())
}

module.exports = { loadUsers, users }
