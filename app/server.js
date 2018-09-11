const express = require('express') // llamamos a Express
const app = express()
const router = require('./routes')

require('./db')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8080 // establecemos nuestro puerto

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Hola Mundo!' })
})

app.use('/api', router)

// iniciamos nuestro servidor
// para tests, porque supertest hace el listen por su cuenta
if (!module.parent) {
  app.listen(port, () => console.log(`API escuchando en el puerto ${port}`))
}

// exportamnos la app para hacer tests
module.exports = app
