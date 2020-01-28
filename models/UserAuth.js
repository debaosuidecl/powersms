// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FrontEndUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }
});

module.exports = FrontEndUser = mongoose.model(
  'frontEndUser',
  FrontEndUserSchema
); // takes in model name and schema
