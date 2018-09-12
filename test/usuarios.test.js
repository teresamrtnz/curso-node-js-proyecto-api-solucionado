/* global describe it beforeEach */
const request = require('supertest')
const expect = require('chai').expect
const validator = require('validator')

const { loadUsers, users } = require('./utils')

beforeEach(loadUsers)

const User = require('../app/models/Usuario')

/* obtenemos nuestra api rest que vamos a testear */

const app = require('../app/server')

/* eslint no-unused-expressions: 0 */
/* por Chai, ver ver https://github.com/eslint/eslint/issues/2102 */

describe('Usuarios', () => {
  describe('POST /users', () => {
    it('Debería crear un nuevo usuario', done => {
      const email = 'curso@curso.com'
      const password = 'P@ssw0rd'

      request(app)
        .post('/api/users')
        .send({ email, password })
        .expect(201)
        .expect(res => {
          expect(res.body._id).to.exist
          expect(res.body.email).to.satisfy(validator.isEmail)
        })
        .end(err => {
          if (err) {
            return done(err)
          }

          User.findOne({ email })
            .then(user => {
              expect(user).to.exist
              done()
            })
            .catch(e => done(e))
        })
    })

    it('Debería dar errores de validación si el email es inválido', done => {
      request(app)
        .post('/api/users')
        .send({
          email: 'and',
          password: '12345678'
        })
        .expect(400)
        .end(done)
    })

    it('Debería dar errores de validación si la contraseña es menor de 6 caracteres', done => {
      request(app)
        .post('/api/users')
        .send({
          email: 'adsf@pepe.com',
          password: '123'
        })
        .expect(400)
        .end(done)
    })

    it('No debería crear el usuario si ya existe otro con ese email', done => {
      request(app)
        .post('/api/users')
        .send({
          email: users[0].email,
          password: 'testPassword'
        })
        .expect(400)
        .end(done)
    })
  })
})
