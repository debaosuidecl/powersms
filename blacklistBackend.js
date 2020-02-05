// const br = require('./blackListAsyncCreator');

const fs = require('fs');
const express = require('express');
const request = require('request');
const apikey = 'aa348f08ebacd25ccb3366ab47d2be1e';
// const fsExtra = require('fs-extra')
const app = express();
let socket = require('socket.io');
// let apikey = '';
let fsExtra = require('graceful-fs');
let PORT = 8024;
const multer = require('multer');
const connectDB = require('./config/db');
const path = require('path');
const csvtojson = require('csvtojson');
app.use(express.json({ extended: false }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Request-Headers', 'GET, PUT, POST, DELETE');

  // res.setHeader("'Content-Type', 'application/json'");
  next();
});

let server = app.listen(PORT, function() {
  console.log(`listening to requests on port ${PORT}`);
  connectDB();
});
// let io = socket(server);

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'blacklistdir');
  },
  filename: function(req, file, cb) {
    // console.log(file.filename)
    // console.log(file);
    cb(null, `${file.originalname}`);
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 9999999999999 }
}).single('file');
let io = socket(server);
io.on('connection', (socket, id) => {
  // console.log(socket.id);?
  console.log(socket.id);
});
app.get('/downloadnew', function(req, res) {
  let q = req.query.q || 1;
  let randomFileName = `./blacklistdir/${q}`;
  try {
    res.download(randomFileName); // Set disposition and send it.
  } catch (e) {
    console.log('error');
  }
});

app.post('/api/upload', (req, res) => {
  upload(req, res, async function(err) {
    console.log(err);
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    res.send('success');
  });
});
function delay(ms) {
  let start = Date.now();
  return new Promise(resolve => setTimeout(resolve, Date.now() + ms - start));
}
let counter = 0;
io.on('connection', socket => {
  console.log(socket.id);

  socket.on('scrub', async ({ filename, traffic, dataowner }) => {
    counter = 0;
    let suppressionWithReasons = {};
    let countObject = {
      filename: `${filename}_blacklist_result.csv`,
      traffic,
      dataowner
    };
    fsExtra.ensureFile(`./blacklistdir/${filename}_blacklist_result.csv`);
    fsExtra.writeFile(
      `./blacklistdir/${filename}_blacklist_result.csv`,
      'first_name,phone,timezone,gender,type,carrier\n'
    );
    // console.log(filename);
    let jsonArray = await csvtojson().fromFile(`./blacklistdir/${filename}`);
    let namePhoneMap = {};
    let phoneGenderMap = {};
    let phoneTimezoneMap = {};
    let onlyPhonesArray = jsonArray.map(o => o.phone);
    let list = [...jsonArray].filter(o => {
      return namePhoneMap.hasOwnProperty(`${o.phone}`)
        ? false
        : (namePhoneMap[`${o.phone}`] = o.first_name);
    });
    let list1 = [...jsonArray].filter(o => {
      return phoneTimezoneMap.hasOwnProperty(`${o.phone}`)
        ? false
        : (phoneTimezoneMap[`${o.phone}`] = o.timezone);
    });
    let list2 = [...jsonArray].filter(o => {
      return phoneGenderMap.hasOwnProperty(`${o.phone}`)
        ? false
        : (phoneGenderMap[`${o.phone}`] = o.gender);
    });
    // console.log(namePhoneMap);
    // return;
    // console.log(namePhoneMap[`12145171501`]);

    // use the split algorithm
    let twoDPhoneArray = split(onlyPhonesArray, 500);

    // time to prepare to send requests
    let concurrencyLimit = 20;
    let results = [];
    const batchesCount = Math.ceil(twoDPhoneArray.length / concurrencyLimit);
    for (let i = 0; i < batchesCount; i++) {
      const batchStart = i * concurrencyLimit;
      const batchArguments = twoDPhoneArray.slice(
        batchStart,
        batchStart + concurrencyLimit
      );
      const batchPromises = batchArguments.map(connectToBlacklist);
      // Harvestin
      try {
        const batchResults = await Promise.all(batchPromises);
        // now we have gotten the results in an array batch
        for (let result of batchResults) {
          suppressionWithReasons = {
            ...suppressionWithReasons,
            ...result.reasons
          };
          countObject.suppressionCount += result.suppression.length;
          console.log(process.memoryUsage().rss, 'memory');

          for (let j = 0; j < Object.values(result.carrier).length; j++) {
            // Object.values(result.carrier)[j];

            if (!countObject[Object.values(result.carrier)[j].name])
              countObject[Object.values(result.carrier)[j].name] = 1;
            else countObject[Object.values(result.carrier)[j].name]++;
            if (
              !suppressionWithReasons.hasOwnProperty(
                Object.values(result.carrier)[j].did
              )
            )
              fsExtra.appendFile(
                `./blacklistdir/${filename}_blacklist_result.csv`,
                `${namePhoneMap[Object.values(result.carrier)[j].did]},${
                  Object.values(result.carrier)[j].did
                },${phoneTimezoneMap[Object.values(result.carrier)[j].did]},${
                  phoneGenderMap[Object.values(result.carrier)[j].did]
                },${Object.values(result.carrier)[j].type},${
                  Object.values(result.carrier)[j].name
                }\n`
              );
            else {
            }
          }
          // if (counter === batchesCount) {
          //   console.log(countObject);
          //   console.log(suppressionWithReasons);
          //   io.sockets.emit('finalCount', countObject);
          //   io.sockets.emit('reasons', suppressionWithReasons);
          //   console.log('finished');
          // }
        }
      } catch (error) {
        console.log(error);
      }

      console.log(((i + 1) / batchesCount) * 100, '%');
      io.sockets.emit('percentageDone', ((i + 1) / batchesCount) * 100);

      // global.gc();
      // global.gc();
    }
    console.log(Object.keys(suppressionWithReasons).length);
    console.log('final end');
    io.sockets.emit('finalCount', countObject);
    io.sockets.emit('reasons', suppressionWithReasons);
    // 2darray = [[1,23,3],[1,23,3],[1,23,3]]
    // console.log(twoDArray);

    // for (let i = 0; i < twoDArray.length; i++) {
    //   connectToBlacklist(
    //     twoDArray[i],
    //     `./blacklistdir/${filename}_blacklist_result.csv`,
    //     i === twoDArray.length - 1,
    //     countObject,
    //     io,
    //     twoDArray.length,
    //     0,
    //     suppressionWithReasons
    //   );
    //   // if (i % 10 === 0) await delay(5000);
    //   await delay(3000)
    //   // console.log('done');
    // }
  });
});
function split(a, n) {
  let newArray = [];
  let total = a;
  for (let i = 0; i < total.length; i++) {
    if (a.length <= 0) return newArray;
    newArray.push([...a.slice(0, n)]);
    a = a.slice(n);
  }
  // return newArray
}

function connectToBlacklist(
  phoneList
  // fileName,
  // isLast,
  // countObject,
  // io,
  // lengthOfBatches,
  // batchNumber,
  // suppressionWithReasons
) {
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
        // counter++;
        // io.sockets.emit('percentageDone', (counter / lengthOfBatches) * 100);
        // console.log('sent');
        if (error) reject(error);
        if (body == 'undefined') reject('undefined');
        else {
          resolve(body);

          // return body;
        }

        // console.log(response.statusCode, 'body');
        // console.log(error, 'error');
      }
    );
  });
}
