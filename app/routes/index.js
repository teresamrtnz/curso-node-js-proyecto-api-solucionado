const router = require('express').Router()
const cervezasRouter = require('./cervezas')
const usersRouter = require('./user')

router.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a nuestra api' })
})

router.use('/cervezas', cervezasRouter)
router.use('/users', usersRouter)

module.exports = router
