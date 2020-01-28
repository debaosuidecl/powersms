// const startDate = new Date().getTime();
// for (let i = 0; i < 1000; i++) {
//   console.log(i);
// }

// console.log(
//   `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
// );

let readline = require('readline');
let fs = require('fs');
require('dotenv').config();
let csv2json = require('csvtojson');

// const returnTime = () => {
//   fs.readFile('time.txt', 'utf-8', (err, data) => {
//     console.log(data);
//     return data;
//   });
// };

// returnTime();
// console.log(returnTime());
// global.timer = 1000;
// // console.log(globalString);
// let rep = (add = 1000) =>
//   setTimeout(() => {
//     console.log('baka');
//     rep();
//     // rep(add + 1000);
//   }, timer);
// rep();

// setTimeout(() => {
//   timer = 10000;
// }, 5000);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let myInterface = readline.createInterface({
  input: fs.createReadStream('dietgender.csv')
});

// let lineno = 0;
// let eba = [];
// const startDate = new Date().getTime();
// myInterface
//   .on('line', async line => {
//     lineno++;
//     eba.push(1);
//     if (lineno === 20) {
//       await delay(10000);
//       console.log('delay time');
//     }
//     // console.log(1);
//     // console.log('Line number ' + lineno + ': ' + line);
//   })
//   .on('close', () => {
//     console.log(lineno);
//     // console.log(eba);
//     console.log('done');
//     console.log(
//       `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
//     );
//   });

// const sendFunc = () => {};

// module.exports = sendFunc;

(async () => {
  const startDate = new Date().getTime();

  const jsonArray = await csv2json().fromFile(`dietgender.csv`);

  for (let i = 0; i < jsonArray.length; i++) {
    if (i % 1000 === 0) {
      console.log('wo');

      await delay(1000);
    }
  }
  console.log(
    `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
  );
  // console.log(jsonArray);
})();
