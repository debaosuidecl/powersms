// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FileNameAccountThree = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumberSending: {
    type: String
    // required: true,
  },
  fileList: [String],

  totalCount: {
    type: String
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
  'FileNameAccountThree',
  FileNameAccountThree
); // takes in model name and schema
