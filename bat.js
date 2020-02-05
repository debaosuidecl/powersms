const asyncPackage = require('async');
let apikey = 'aa348f08ebacd25ccb3366ab47d2be1e';

// the base blacklist api
const fetchBA = phoneList => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://api.theblacklist.click/standard/api/v3/bulkLookup/key/${apikey}/response/json`,

        json: {
          phones: phoneList
        },

        method: 'POST'
      },
      function(error, response, body) {
        if (error) reject(error);
        else resolve(body);

        // console.log(response.statusCode, 'body');
        // console.log(error, 'error');
      }
    );
  });
};

var obj = { dev: '/dev.json', test: '/test.json', prod: '/prod.json' };

// async.forEachOf(obj, (value, key, callback) => {
// //   fs.readFile(__dirname + value, "utf8", (err, data) => {
// //       if (err) return callback(err);
// //       try {
// //           configs[key] = JSON.parse(data);
// //       } catch (e) {
// //           return callback(e);
// //       }
// //       callback();
// //   });
// // }, err => {
// //   if (err) console.error(err.message);
// //   // configs is now a map of JSON data
// //   doSomethingWith(configs);
// });
async function take2() {
  // Running Promises in parallel
  const listOfPromises = listOfArguments.map(asyncOperation);
  // Harvesting
  return await Promise.all(listOfPromises);
}
