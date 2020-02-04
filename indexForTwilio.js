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
const q = require('query-string');
const accountSid = 'AC866fa511053e3a30b6a0b0d1af276d81';
const authToken = '244946e0ff6fa32b864de9de41b7feaa';
const client = require('twilio')(accountSid, authToken);

let uuid = require('uuid');

app.use(cors());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader('Access-Control-Request-Headers', 'GET, PUT, POST, DELETE');

  // res.setHeader("'Content-Type', 'application/json'");
  next();
});
const PORT = 7111;
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
global.DELIVEREDCOUNT = 0;
global.UNDELIVEREDCOUNT = 0;
global.FAILEDCOUNT = 0;
global.REJECTS_ARRAY = [];
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
    let file = fsExtra.existsSync('./public/fileTwilio.csv');
    // const messageCount = await Messages.countDocuments();
    // console.log(messageCount);
    // const fileStatus = await FileName.findOne({});
    // console.log(file);
    if (file) {
      fs.readFile('./public/fileTwilio.csv', 'utf8', (err, data) => {
        res.json({
          exists: data,
          deliveredCount: DELIVEREDCOUNT,
          // NUMBER_OF_SENDS,
          unDeliveredCount: UNDELIVEREDCOUNT,
          // unknownCount,
          failed: FAILEDCOUNT,

          messageCount: NUMBER_OF_SENDS
          // ...fileStatus
        });
      });
    } else {
      res.json({
        exists: false,
        deliveredCount: DELIVEREDCOUNT,
        // NUMBER_OF_SENDS,
        failed: FAILEDCOUNT,
        unDeliveredCount: UNDELIVEREDCOUNT,
        // unknownCount,
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
    cb(null, 'fileTwilio.csv');
  }
});

var upload = multer({ storage: storage }).single('file');

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
const statusSwitch = (s, io) => {
  switch (s) {
    case 'delivered':
      DELIVEREDCOUNT += 1;
      return io.sockets.emit(s, DELIVEREDCOUNT);
    case 'undelivered':
      UNDELIVEREDCOUNT += 1;
      return io.sockets.emit(s, UNDELIVEREDCOUNT);
    case 'failed':
      FAILEDCOUNT += 1;
      return io.sockets.emit(s, FAILEDCOUNT);
  }
};

io.on('connection', (socket, id) => {
  app.post('/api/twiliocallback', (req, res) => {
    console.log(req.body);
    try {
      const jsonconv = q.parse(req.body);
      if (jsonconv.ErrorCode) {
        REJECTS_ARRAY.push({ phone: jsonconv.To, message: req.query.message });
      }
      statusSwitch(jsonconv.MessageStatus, io);
    } catch (error) {
      console.log(err);
    }
  });
  // app.get('/api', (req, res) => {
  console.log('connected');
  app.get('/api/downloadnew', async function(req, res) {
    // let q = req.query.q || 1;
    let randomFileName = `./public/fileTwilio.csv`;
    try {
      res.download(randomFileName); // Set disposition and send it.
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
    var csvUnused = convertJsonToCsv
      .convertArrayOfObjects(JSON_UNUSED, ['phone', 'message'])
      .replace(/["']/g, '');

    fs.writeFile('./public/fileTwilio.csv', csvUnused, async err => {
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

  socket.on('start', async data => {
    DELAY = 1000;

    DONOTCONTINUEWITHSEND = false;

    const startDate = new Date().getTime();
    let phoneArrayTwilio = await csvtojson().fromFile(`twiliophones.csv`);
    let actualPhoneArray = phoneArrayTwilio.map(o => o.phone);

    let jsonArray = await csvtojson().fromFile(`./public/fileTwilio.csv`);
    JSON_UNUSED = jsonArray;
    io.sockets.emit('totalNumber', jsonArray.length);

    for (let i = 0; i < jsonArray.length; i++) {
      if (DONOTCONTINUEWITHSEND) {
        return;
      } else {
        client.messages
          .create({
            body: jsonArray[i].message,
            to:
              `${jsonArray[i].phone}`[0] == '1'
                ? `+${jsonArray[i].phone}`
                : `+1${jsonArray[i].phone}`,
            from:
              '+' +
              ActualPhoneArray[
                Math.floor(Math.random() * actualPhoneArray.length)
              ],
            statusCallback: `https://twilio.powersms.land/api/twiliocallback?message=${jsonArray[i].message}`
          })
          .then(m => {
            // console.log(body);
            NUMBER_OF_SENDS++;
            try {
              io.sockets.emit('sent', NUMBER_OF_SENDS);
              io.sockets.emit('totalNumber', [...JSON_UNUSED].slice(1).length);
              JSON_UNUSED = [...JSON_UNUSED].slice(1);
            } catch (error) {
              console.log(error);
            }
          });
        /// test
        console.log(
          actualPhoneArray[Math.floor(Math.random() * actualPhoneArray.length)]
        );
        // delay(500).then(() => {
        //   console.log('send');
        //   try {
        //     NUMBER_OF_SENDS++;
        //     io.sockets.emit('sent', NUMBER_OF_SENDS);
        //     io.sockets.emit('totalNumber', [...JSON_UNUSED].slice(1).length);
        //     JSON_UNUSED = [...JSON_UNUSED].slice(1);
        //   } catch (error) {
        //     console.log(error);
        //   }
        // });
      }

      if (i % SENDS_PER_SECOND === 0) {
        console.log(process.memoryUsage());
        console.log('wo');
        let sendTime = await delay(DELAY);
        clearTimeout(sendTime);
      }
    }
    if (REJECTS_ARRAY.length > 0) {
      var rejectedPhones = convertJsonToCsv
        .convertArrayOfObjects(REJECTS_ARRAY, ['phone', 'message'])
        .replace(/["']/g, '');

      fs.writeFile('./public/fileTwilio.csv', rejectedPhones, (err, data) => {
        io.sockets.emit('sendToRejects');
      });
    } else {
      io.sockets.emit('operationComplete', true);
      console.log(
        `Time elapsed ${Math.round(
          (new Date().getTime() - startDate) / 1000
        )} s`
      );
      fs.unlink('./public/fileTwilio.csv', (err, data) => {
        console.log('file unlink success');
      });
    }
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
