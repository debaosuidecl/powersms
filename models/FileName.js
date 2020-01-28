// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FileName = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  totalCount: {
    type: String
  },
  phoneNumberSending: {
    type: String
    // required: true,
  },
  withLeadingOne: {
    type: Boolean
  },
  isSending: {
    type: Boolean,
    default: false
  },
  displayName: {
    type: String
  },
  isPause: {
    type: Boolean,
    default: false
  },
  fileList: [String],

  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = MessagesData = mongoose.model('FileName', FileName); // takes in model name and schema
