// let readline = require('readline');
// let fs = require('fs');

// let myInterface = readline.createInterface({
//   input: fs.createReadStream('../dietgender.csv')
// });

// let lineno = 0;
// myInterface.on('line', function(line) {
//   lineno++;
//   console.log('Line number ' + lineno + ': ' + line);
// });
// let readline = require('readline');
let fs = require('fs');
require('dotenv').config();
let csv2json = require('csvtojson');

const sendFunc = fileName => {
  // const startDate = new Date().getTime();
  // const jsonArray = await csv2json().fromFile(`../${fileName}.csv`);
  // for (let i = 0; i < jsonArray.length; i++) {
  //   if (i % SENDS_PER_SECOND === 0) {
  //     console.log('wo');
  //     await delay(1000);
  //   }
  // }
  // console.log(
  //   `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
  // );
};

module.exports = sendFunc;
