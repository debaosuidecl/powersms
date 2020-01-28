const connectDB = require('./config/db');
const PhoneFDN2Way1 = require('./models/PhoneFDN2Way1');
const moment = require('moment');
connectDB();
let timeout;

console.log(
  new Date(
    moment(new Date())
      .add(0, 'm')
      .toISOString()
  ) > new Date()
);
console.log(new Date());
// return;
const update = async () => {
  try {
    PhoneFDN2Way1.updateMany(
      {
        resting: true,
        timeTillRevival: {
          $lt: new Date()
        }
      },
      {
        $set: {
          rejectCount: [],
          resting: false
          // timeTillRevival: new Date()
        }
      },
      (err, data) => {
        console.log(data, ' was affected');
        setTimeout(() => process.exit(1), 300000);
      }
    );
  } catch (error) {
    update();
  }
};

update();
