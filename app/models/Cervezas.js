const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cervezaSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  descripción: String,
  graduación: String,
  envase: String,
  precio: String
})

const Cervezas = mongoose.model('Cerveza', cervezaSchema)

module.exports = Cervezas
