/* global describe it beforeEach */
const request = require('supertest')
const expect = require('chai').expect
const { ObjectID } = require('mongodb')

/* obtenemos nuestra api rest que vamos a testear */

const app = require('../app/server')

// reset models and schema from previous tests:
// see https://github.com/Automattic/mongoose/issues/1251

const mongoose = require('mongoose')
mongoose.models = {}
mongoose.modelSchemas = {}

const Cervezas = require('../app/models/Cervezas')
const cervezas = require('../data/cervezas.json')

// añadimos _id para poder testear con _id el GET /api/cervezas/id o DELETE api/cervezas/id
cervezas.forEach(cerveza => (cerveza._id = new ObjectID()))

const idTest = new ObjectID()

const cerveza = {
  nombre: 'Cervezas de test',
  descripción: 'Descripción de la cerveza de test',
  graduación: '5º',
  envase: 'Botellín',
  precio: '2€'
}

beforeEach(done => {
  Cervezas.deleteMany({})
    .then(() => {
      return Cervezas.insertMany(cervezas)
    })
    .then(() => done())
})

describe('Recurso cervezas', () => {
  describe('Obtener todas las cervezas', () => {
    it('Debería obtener todas', done => {
      request(app)
        .get('/api/cervezas')
        .expect(200)
        .expect(res => {
          expect(res.body.length).to.be.equal(9)
        })
        .end(done)
    })
  })

  describe('Obtener una cerveza', () => {
    it('La obtiene mediante id', done => {
      request(app)
        .get(`/api/cervezas/${cervezas[0]._id.toHexString()}`)
        .expect(200)
        .expect(res => {
          expect(res.body.nombre).to.be.equal(cervezas[0].nombre)
        })
        .end(done)
    })
    it('La obtiene por palabra clave', done => {
      request(app)
        .get('/api/cervezas/search?q=regaliz')
        .expect(200)
        .expect(res => {
          expect(res.body[0].nombre).to.be.equal(cervezas[0].nombre)
        })
        .end(done)
    })

    it('Devuelve un 404 si no existe su id', done => {
      request(app)
        .get(`/api/cervezas/${idTest}`)
        .expect(404)
        .end(done)
    })

    it('Devuelve un 404 si no existe la palabra clave', done => {
      request(app)
        .get(`/api/cervezas/search?q=perejil`)
        .expect(404)
        .end(done)
    })

    it('Devuelve un 404 si el id es erróneo', done => {
      request(app)
        .get(`/api/cervezas/idErróneo`)
        .expect(404)
        .end(done)
    })
  })

  describe('Crear una cerveza nueva', () => {
    it('Crea una cerveza si los datos son válidos', done => {
      request(app)
        .post('/api/cervezas')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(cerveza)
        .expect(201)
        .expect(res => {
          expect(res.body).to.include(cerveza)
        })
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          Cervezas.find({ nombre: cerveza.nombre })
            .then(cervezas => {
              expect(cervezas.length).to.be.equal(1)
              expect(cervezas[0]).to.include(cerveza)
              done()
            })
            .catch(e => done(e))
        })
    })

    it('No crea la cerveza si los datos no son válidos', done => {
      request(app)
        .post('/api/cervezas')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err)
          }
          done()
        })
    })
  })
  describe('Borrar una cerveza', () => {
    it('La borra si existe', done => {
      request(app)
        .delete(`/api/cervezas/${cervezas[0]._id.toHexString()}`)
        .expect(200)
        .expect(res => {
          expect(res.body.nombre).to.be.equal(cervezas[0].nombre)
        })
        .end(done)
    })
    it('Devuelve un 404 si no existe', done => {
      request(app)
        .delete(`/api/cervezas/${idTest}`)
        .expect(404)
        .end(done)
    })
    it('Devuelve un 404 si el id es erróneo', done => {
      request(app)
        .delete(`/api/cervezas/idErróneo`)
        .expect(404)
        .end(done)
    })
  })
  describe('Actualiza una cerveza', () => {
    it('Debería actualizar la cerveza', done => {
      const hexId = cervezas[0]._id.toHexString()
      request(app)
        .put(`/api/cervezas/${hexId}`)
        .send(cerveza)
        .expect(200)
        .expect(res => {
          expect(res.body.nombre).to.be.equal(cerveza.nombre)
          expect(res.body.descripción).to.be.equal(cerveza.descripción)
          expect(res.body.graduación).to.be.equal(cerveza.graduación)
          expect(res.body.envase).to.be.equal(cerveza.envase)
          expect(res.body.precio).to.be.equal(cerveza.precio)
        })
        .end(done)
    })
    it('Devuelve un 404 si no existe', done => {
      request(app)
        .put(`/api/cervezas/${idTest}`)
        .send(cerveza)
        .expect(404)
        .end(done)
    })
    it('Devuelve un 404 si el id es erróneo', done => {
      request(app)
        .put(`/api/cervezas/idErróneo`)
        .send(cerveza)
        .expect(404)
        .end(done)
    })
  })
})
