// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/lab6')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

module.exports = mongoose.connection;