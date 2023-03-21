const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const contactsRouter = require('./routes/api/contacts')
require('dotenv').config()

const app = express()

const MONGO_URL = process.env.MONGO_URL

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Mongo DB successfully connected')
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  });


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const { status } = err
  res.status(status || 500).json({ message: err.message })
})

module.exports = app
