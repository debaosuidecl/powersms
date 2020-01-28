const connectDB = require('./config/db');
const PhoneFDN2Way1 = require('./models/PhoneFDN2Way1');
let csvtojson = require('csvtojson');
let moment = require('moment');
connectDB();

(async () => {
  let jsonArray = await csvtojson().fromFile(`phoneNumberAccount2.csv`);
  console.log(jsonArray);
  jsonArray = jsonArray.map(j => {
    return { phone: j.phone, resting: false, rejectCount: [] };
  });
  PhoneFDN2Way1.collection.insertMany(jsonArray, (err, result) => {
    console.log('done');
  });
})();

// (async () => {
//   // let random = await PhoneFDN2Way1.findRandom({}, {}, { limit: 5 });
//   // console.log(random);
//   const count = await PhoneFDN2Way1.randomSearch(100);
//   console.log(count);
// })();
// let oldDateObj = new Date();
// let time30 = moment(oldDateObj)
//   .add(30, 'm')
//   .toDate();
// console.log(time30.toTimeString());
