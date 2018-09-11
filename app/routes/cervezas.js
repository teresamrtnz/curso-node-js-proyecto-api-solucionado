const router = require('express').Router()
const cervezasController = require('../controllers/cervezasController')

router.get('/search', (req, res) => {
  cervezasController.search(req, res)
})
router.get('/', (req, res) => {
  cervezasController.list(req, res)
})
router.get('/:id', (req, res) => {
  cervezasController.show(req, res)
})
router.post('/', (req, res) => {
  cervezasController.create(req, res)
})
router.put('/:id', (req, res) => {
  cervezasController.update(req, res)
})
router.delete('/:id', (req, res) => {
  cervezasController.remove(req, res)
})
module.exports = router
