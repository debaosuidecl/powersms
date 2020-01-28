// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const Messages = new mongoose.Schema({
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

module.exports = MessagesData = mongoose.model('Messages', Messages); // takes in model name and schema
