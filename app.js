const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// const ordersRoutes = require('./routes/orders-route');
const officersRoutes = require('./routes/officers-route')
const usersRoutes = require('./routes/users-route')
const emailRoutes = require('./routes/emails-route')
const HttpError = require('./models/http-error');

const app = express();

app.use(cors());

const uri = process.env.REACT_APP_MONGO_SERVER_DEV;

app.use(bodyParser.json());

app.use('/uploads/files', express.static(path.join('uploads', 'files')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// app.use('/api/orders', ordersRoutes);
app.use('/api/officer', officersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/email', emailRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  // res.status(error.code || 500)
  // res.json({message: error.message || 'An unknwon error occured!'})
  res.status(500).json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(uri)
  .then(() => app.listen('5000'))
  .catch(err => {console.log(err)})

module.exports = app
