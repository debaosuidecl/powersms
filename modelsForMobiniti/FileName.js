// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FileNameMobiniti = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  phoneFileName: {
    type: String
  },
  isPause: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = FileName = mongoose.model(
  'FileNameMobiniti',
  FileNameMobiniti
); // takes in model name and schema
