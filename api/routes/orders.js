const express = require('express')
const router = express.Router()
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

router.post('/', (req, res) => {
  Orders.create(req.body)
    .then(x => res.status(201).send(x))
})
router.put('/:id', (req, res) => {
  Orders.findByIdAndUpdate(req.params.id, req.body)
  .then(() => res.status(204))
})

router.delete('/:id', (req, res) => {
  Orders.findOneAndDelete(req.params.id)
    .exec()
    .then(() => res.status(204).send('Eliminado'))
})

module.exports = router