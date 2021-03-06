const express = require('express')
const mongoose = require('mongoose')
const app = express()

const meals = require('./routes/meals')
const orders = require('./routes/orders')
const auth = require('./routes/auth')

const options ={
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
} 
mongoose.connect(process.env.MONGODB_URI,options)

app.use(express.json())
app.use('/api/meals', meals)
app.use('/api/orders', orders)
app.use('/api/auth', auth)


module.exports = app
