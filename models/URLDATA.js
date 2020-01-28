// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FileName = new mongoose.Schema({
  forwardURL: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = MessagesData = mongoose.model('FileName', FileName); // takes in model name and schema
