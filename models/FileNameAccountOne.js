// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FileNameAccountOne = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  totalCount: {
    type: String
  },
  fileList: [String],

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
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = MessagesData = mongoose.model(
  'FileNameAccountOne',
  FileNameAccountOne
); // takes in model name and schema
