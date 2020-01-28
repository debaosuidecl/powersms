// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const MessageCounts = new mongoose.Schema({
  sentCount: {
    type: String
  },
  deliveredCount: {
    type: String
  },
  unDeliveredCount: {
    type: String
  },
  enrouteCount: {
    type: String
  },
  rejectedCount: {
    type: String
  },
  unknownCount: {
    type: String
  },
  sentStatus: {
    type: String
  },
  expiredCount: {
    type: String
  },
  deletedCount: {
    type: String
  },
  acceptedCount: {
    type: String
  }
});

module.exports = MessageCountsData = mongoose.model(
  'MessageCounts',
  MessageCounts
); // takes in model name and schema
