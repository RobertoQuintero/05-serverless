const express = require('express')
const router = express.Router()
const { isAuthenticated, hasRoles } = require('../auth')
const Orders = require('../models/Orders')

router.get('/', (req, res) => {
  Orders.find()
    .exec()
    .then(x => res.send(x))
})

router.get('/:id', (req, res) => {
  Orders.findById(req.params.id)
    .exec()
    .then(x => res.status(200).send(x))
})

router.post('/', isAuthenticated, (req, res) => {
  const { _id } = req.user
  Orders.create({ ...req.body, user_id: _id })
    .then(x => res.status(201).send(x))
})
router.put('/:id', isAuthenticated,hasRoles(['admin','user']), (req, res) => {
  Orders.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.status(204))
})

router.delete('/:id', isAuthenticated, (req, res) => {
  Orders.findOneAndDelete(req.params.id)
    .exec()
    .then(() => res.status(204).send('Eliminado'))
})

module.exports = router