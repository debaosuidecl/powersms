// // class Timeout {
// //   constructor(ms) {
// //     this.ms = ms;
// //   }
// //   promise() {
// //     let timeout = null;
// //     return new Promise((resolve, reject) => {
// //       timeout = setTimeout(() => {
// //         resolve({ message: 'done', timeout });
// //       }, this.ms);
// //     });
// //   }
// // }

// // // let timeoutObject = ;

// // new Timeout(1000).promise().then(res => {
// //   console.log(res);
// //   clearTimeout(res.timeout);
// //   console.log('timeout cleared');
// // });
// function delay(ms) {
//   let start = Date.now();
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// (async () => {
//   start = Date.now();
//   console.log('start');
//   await delay(1000);
//   console.log(Date.now() - start);
// })();

setTimeout(() => {
  console.log('never');
  console.log(Infinity);
}, Infinity);
