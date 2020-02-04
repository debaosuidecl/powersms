// const br = require('./blackListAsyncCreator');

const fs = require('fs');
const express = require('express');
const request = require('request');
const apikey = 'aa348f08ebacd25ccb3366ab47d2be1e';
// const fsExtra = require('fs-extra')
const app = express();
let socket = require('socket.io');
// let apikey = '';
let fsExtra = require('fs-extra');
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




  socket.on('scrub', async filename => {
    counter = 0;
    let suppressionWithReasons = {};
    let countObject = {
      filename: `${filename}_blacklist_result.csv`
    };
    fsExtra.ensureFile(`./blacklistdir/${filename}_blacklist_result.csv`);
    fsExtra.writeFile(
      `./blacklistdir/${filename}_blacklist_result.csv`,
      'did,type,carrier\n'
    );
    // console.log(filename);
    let jsonArray = await csvtojson().fromFile(`./blacklistdir/${filename}`);
    let onlyPhonesArray = jsonArray.map(o => o.phone);
    let twoDArray = split(onlyPhonesArray, 500);
    // 2darray = [[1,23,3],[1,23,3],[1,23,3]]
    // console.log(twoDArray);
    for (let i = 0; i < twoDArray.length; i++) {
      connectToBlacklist(
        twoDArray[i],
        `./blacklistdir/${filename}_blacklist_result.csv`,
        i === twoDArray.length - 1,
        countObject,
        io,
        twoDArray.length,
        0,
        suppressionWithReasons
      );
      // if (i % 10 === 0) await delay(5000);
      await delay(3000)
      // console.log('done');
    }
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
  phoneList,
  fileName,
  isLast,
  countObject,
  io,
  lengthOfBatches,
  batchNumber,
  suppressionWithReasons
) {
  request(
    {
      uri: `https://api.theblacklist.click/standard/api/v3/bulkLookup/key/${apikey}/response/json`,

      json: {
        phones: phoneList
      },

      method: 'POST'
    },
    function(error, response, body) {

      counter++;
      io.sockets.emit('percentageDone', (counter / lengthOfBatches) * 100);
      console.log('sent');
      if (error) console.log(error);
      if (body == 'undefined') console.log('Undefined');
      else {
        // console.log(body);
        suppressionWithReasons = {
          ...suppressionWithReasons,
          ...body.reasons
        };
        countObject.suppressionCount += body.suppression.length;
        console.log(process.memoryUsage(), 'memory');

        for (let i = 0; i < Object.values(body.carrier).length; i++) {
          Object.values(body.carrier)[i];

          if (!countObject[Object.values(body.carrier)[i].name])
            countObject[Object.values(body.carrier)[i].name] = 1;
          else countObject[Object.values(body.carrier)[i].name]++;
          if (
            !suppressionWithReasons.hasOwnProperty(
              Object.values(body.carrier)[i].did
            )
          )
            fsExtra.appendFile(
              fileName,
              `${Object.values(body.carrier)[i].did},${
                Object.values(body.carrier)[i].type
              },${Object.values(body.carrier)[i].name}\n`
            );
          else {
          }
        }
        if (counter === lengthOfBatches) {
          console.log(countObject);
          console.log(suppressionWithReasons);
          io.sockets.emit('finalCount', countObject);
          io.sockets.emit('reasons', suppressionWithReasons);
          console.log('finished');
        }
        return body;
      }

      // console.log(response.statusCode, 'body');
      // console.log(error, 'error');
    }
  );
}
