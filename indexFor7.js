const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
let socket = require('socket.io');
const connectDB = require('./config/db.js');
let cors = require('cors');
let multer = require('multer');
let request = require('request');
let csvtojson = require('csvtojson');
let fs = require('fs');
let fsExtra = require('fs-extra');
let csv = require('csv-parser');
let Messages = require('./models/Messages');
const { Parser } = require('json2csv');
const convertJsonToCsv = require('convert-json-to-csv');

let FileName = require('./models/FileName');
// let sendFunctions = require('./sendFunctions/sendFunctions');
// let
let uuid = require('uuid');
// console.log(uuid());
// return;
app.use(cors());
const PORT = 7000;
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
connectDB();

let server = app.listen(PORT, function() {
  console.log(`listening to requests on port ${PORT}`);
});
global.SENDS_PER_SECOND = 10;
global.NUMBER_OF_SENDS = 0;
global.DELAY = 1000;
global.IS_TEST = true;
global.IS_SENDING = false;
global.FILENAME = '';
global.DONOTCONTINUEWITHSEND = false;

global.JSON_UNUSED = [];
app.post('/api/text', async (req, res) => {
  let newtimeout = await delay(1000);
  res.json({
    data: 'Success "c723d42a-c3ee-452c-940b-3d8e8b944868',
    body: req.body
  });
  clearTimeout(newtimeout);
});
// app.get('/api/reportCount', async (req, res) => {
//   // await delay(1000);
// });
app.post('/api/clearLogs', async (req, res) => {
  try {
    NUMBER_OF_SENDS = 0;
    res.json({ success: true });
  } catch (error) {}
});
app.get('/api/checkForFileExistence', async (req, res) => {
  try {
    // let deliveredCount = await Messages.countDocuments({ status: 'DELIVRD' });
    // let unDeliveredCount = await Messages.countDocuments({ status: 'UNDELIV' });
    // let unknownCount = await Messages.countDocuments({ status: 'UNKNOWN' });
    // res.json({ deliveredCount, unDeliveredCount, unknownCount });
    let file = fsExtra.existsSync('./public/file7.csv');
    // const messageCount = await Messages.countDocuments();
    // console.log(messageCount);
    // const fileStatus = await FileName.findOne({});
    // console.log(file);
    if (file) {
      fs.readFile('./public/file7.csv', 'utf8', (err, data) => {
        res.json({
          exists: data,
          // deliveredCount,
          // NUMBER_OF_SENDS,
          // unDeliveredCount,
          // unknownCount,
          messageCount: NUMBER_OF_SENDS
          // ...fileStatus
        });
      });
    } else {
      res.json({
        exists: false,
        messageCount: NUMBER_OF_SENDS
      });
    }
  } catch (e) {
    console.log(e);
  }
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, 'file7.csv');
  }
});
var numberStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, 'number.csv');
  }
});

var upload = multer({ storage: storage }).single('file');
var uploadNumbers = multer({ storage: numberStorage }).single('numbers');

app.post('/api/upload', (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file);
    res.send('success');
    //  res.status(200).send(req.file)
  });
});

app.post('/api/uploadnumbers', (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file);
    res.send('success');
    //  res.status(200).send(req.file)
  });
});
let io = socket(server);

io.on('connection', (socket, id) => {
  // app.get('/api', (req, res) => {
  console.log('connected');
  // res.send('success');
  app.get('/api/downloadnew', async function(req, res) {
    // let q = req.query.q || 1;
    let randomFileName = `./public/file7.csv`;
    try {
      res.download(randomFileName); // Set disposition and send it.
      // socket.disconnect();
      await delay(4000);
      // process.exit(1);
    } catch (e) {
      console.log('error');
    }
  });

  socket.on('kill', async _ => {
    io.sockets.emit('processKilled', true);
    process.exit(1);
  });
  socket.on('pause', async _ => {
    // JSON_UNUSED
    DONOTCONTINUEWITHSEND = true;
    console.log('pause me now');
    DELAY = 999999;
    const fileStatus = await FileName.findOne({});
    fileStatus.isPause = true;
    await fileStatus.save();
    // const json2csvParser = new Parser({ fields: ['phone', 'message'] });
    // const csvUnused = json2csvParser.parse(JSON_UNUSED).replace(`"`, ``);
    // var arrayOfArraysCsv = convertJsonToCsv.convertArrayOfArrays(JSON_UNUSED);
    var csvUnused = convertJsonToCsv
      .convertArrayOfObjects(JSON_UNUSED, ['phone', 'message'])
      .replace(/["']/g, '');

    fs.writeFile('./public/file7.csv', csvUnused, async err => {
      // throws an error, you could also catch it here

      io.sockets.emit('pauseDone', csvUnused);
      if (err) throw err;
      console.log('csv saved!');
      await delay(2000);
      // process.exit(1);

      // success case, the file was saved
    });
  });
  socket.on('setSpeed', speed => {
    SENDS_PER_SECOND = speed;
    console.log('newspeed', SENDS_PER_SECOND);
  });
  socket.on('doNotContinueWithSend', () => {
    // SENDS_PER_SECOND = speed;
    // console.log('newspeed', SENDS_PER_SECOND);
    DONOTCONTINUEWITHSEND = true;
  });
  // });
  // console.log('here is the id ', socket.id);

  let token = `aGVsbDIxNDY6WmdUVERaUXU=`;
  app.get('/api/delivery/:phoneNumber', (req, res) => {
    // console.log(req.query);
    console.log(req.params);

    res.json(req.query);
  });
  socket.on('start', async data => {
    DELAY = 1000;

    DONOTCONTINUEWITHSEND = false;
    // let timeout;

    const { filename, ani, withLeadingOne } = data;
    if (!ani) {
      return io.sockets.emit('stop', true);
    }

    let fileNew = await FileName.findOne({ name: 'file.csv' });
    // fileNew.isSending = true;
    fileNew.isPause = false;
    fileNew.displayName = filename;
    fileNew.phoneNumberSending = ani;
    fileNew.withLeadingOne = withLeadingOne;
    fileNew.save(function(err) {
      if (err) return handleError(err);
      // saved!
    });
    const startDate = new Date().getTime();

    let jsonArray = await csvtojson().fromFile(`./public/file7.csv`);
    JSON_UNUSED = jsonArray;

    io.sockets.emit('totalNumber', jsonArray.length);
    sendMessages(jsonArray, SENDS_PER_SECOND, token, startDate, withLeadingOne);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function sendMessages(
  jsonArray,
  sendSpeed,
  token,
  startDate,
  theUserDidNotEnterPhoneNumberWithLeadingOne
) {
  console.log(
    jsonArray
      .map(group =>
        `${group.phone}`[0] === '1' ? `${group.phone}` : `1${group.phone}`
      )
      .slice(0, sendSpeed)
  );
  console.log(jsonArray[0].message);

  request(
    {
      uri: `http://localhost:7000/api/text`,
      // uri: `https://rest-api.d7networks.com/secure/sendbatch`,

      body: JSON.stringify({
        messages: [
          {
            to: jsonArray
              .map(group =>
                `${group.phone}`[0] === '1'
                  ? `${group.phone}`
                  : `1${group.phone}`
              )
              .slice(0, sendSpeed),
            content: jsonArray[0].message,
            from: 2132334
          }
        ]
      }),
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    },
    // ``,
    function(error, response, body) {
      console.log(body);
      if (error) console.log(error);
      try {
        let docs = jsonArray.slice(0, sendSpeed);

        // Messages.insertMany(docs, function(err) {
        //   if (err) console.log(err);
        io.sockets.emit('sent', docs.length);
        io.sockets.emit(
          'totalNumber',
          [...JSON_UNUSED].slice(sendSpeed).length
        );

        NUMBER_OF_SENDS += docs.length;
        // });
      } catch (error) {
        console.log(error);
      }
    }
  );

  JSON_UNUSED = [...JSON_UNUSED].slice(sendSpeed);
  sendSpeed = SENDS_PER_SECOND;
  if (DONOTCONTINUEWITHSEND) {
  } else if (JSON_UNUSED.length > 0) {
    console.log('wo');
    let sendTime = await delay(DELAY);
    clearTimeout(sendTime);
    sendMessages(
      JSON_UNUSED,
      SENDS_PER_SECOND,
      token,
      startDate,
      theUserDidNotEnterPhoneNumberWithLeadingOne
    );
  } else {
    io.sockets.emit('operationComplete', true);

    console.log(
      `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
    );
    fs.unlink('./public/7.csv', (err, data) => {
      console.log('file unlink success');
    });
    let fileFromDb = await FileName.findOne({ name: 'file.csv' });

    fileFromDb.isSending = false;
    fileFromDb.isPause = false;
    await fileFromDb.save();
    console.log('saved');
    console.log('end');
  }
}
