// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const MessagesAccountOne = new mongoose.Schema({
  phone: {
    type: String,
    required: true

    // unique: true
  },
  message: {
    type: String,
    required: true
    // unique: true
  },
  messageId: {
    type: String
    // required: true
  },
  senderId: {
    type: String
  },
  status: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = MessagesData = mongoose.model(
  'MessagesAccountOne',
  MessagesAccountOne
); // takes in model name and schema
