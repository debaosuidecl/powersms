let FileName = require('./modelsForMobiniti/FileName');
let connectDb = require('./config/db');

connectDb();

// FileName.findOne({}, (err, docs) => {
//   console.log(docs);
// });
(async () => {
  const newf = new FileName({
    name: 'file.csv',
    isSending: false,
    isPause: false,
    phoneNumberSending: '12121331423',
    withLeadingOne: false,
    displayName: ''
  });

  await newf.save();
  console.log('success');
})();
