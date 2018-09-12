const User = require('../models/Usuario')

const create = (req, res) => {
  // recogemos los datos del body que nos interesen:
  const { email, password } = req.body
  const user = new User({ email, password })
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        message: 'Error al guardar el usuario',
        error: err
      })
    }
    return res.status(201).json(user)
  })
}

module.exports = { create }
