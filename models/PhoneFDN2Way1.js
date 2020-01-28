// THIS IS THE USER SCHEMA FILE
var random = require('mongoose-simple-random');

const mongoose = require('mongoose');

const PhoneFDN2way1Schema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  timeTillRevival: {
    type: Date
  },
  rejectCount: {
    type: [String]
  },
  resting: {
    default: false
  },
  date: {
    type: Date,
    default: Date.now()
  }
});
PhoneFDN2way1Schema.statics.randomSearch = async function(limit) {
  const count = await this.countDocuments({ resting: false });
  const rand = Math.floor(Math.random() * count);
  const randomDoc = await this.findOne()
    .limit(limit)
    .skip(rand);
  return randomDoc;
};

module.exports = PhoneFDN2way1 = mongoose.model(
  'PhoneFDN2wayOne',
  PhoneFDN2way1Schema
); // takes in model name and schema
