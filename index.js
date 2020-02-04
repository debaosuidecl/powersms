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
let MessageCounts = require('./models/MessageCounts');
const { Parser } = require('json2csv');
const convertJsonToCsv = require('convert-json-to-csv');

let FileName = require('./models/FileName');
// let sendFunctions = require('./sendFunctions/sendFunctions');
// let
let uuid = require('uuid');
// console.log(uuid());
// return;
class Timeout {
  constructor(ms) {
    this.ms = ms;
  }
  promise() {
    let timeout = null;
    return new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        resolve({ message: 'done', timeout });
      }, this.ms);
    });
  }
}
app.use(cors({ origin: '*' }));
app.use(express.json());

const PORT = 9090;
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader('Access-Control-Request-Headers', 'GET, PUT, POST, DELETE');

  // res.setHeader("'Content-Type', 'application/json'");
  next();
});
function delay(ms) {
  // let start = Date.now();
  return new Promise(resolve => setTimeout(resolve, ms));
}
connectDB();

let server = app.listen(PORT, function() {
  console.log(`listening to requests on port ${PORT}`);
});

global.SENDS_PER_SECOND = 10;
global.NUMBER_OF_SENDS = 0;
global.TOTALNUMBER = 0;
global.DELAY = 2000;
global.IS_TEST = true;
global.IS_SENDING = false;
global.FILENAME = '';
global.DONOTCONTINUEWITHSEND = false;
global.DELIVEREDCOUNT = 0;
global.UNDELIVEREDCOUNT = 0;
global.ENROUTECOUNT = 0;
global.SENTSTATUSCOUNT = 0;
global.FAILEDCOUNT = 0;
global.JSON_TO_SLICE = 0;
global.REJECTS_ARRAY = [];
global.JSON_UNUSED = [];

app.get('/api/text', async (req, res) => {
  let newtimeout = await delay(0);
  res.json({
    messageId: [
      '5e05ae1c-44c6-297b-d354-f4fb58ab179e',
      '5e05ae1c-a035-9bcb-2a7e-465bc78ebe6d'
    ][Math.floor(Math.random() * 2)]
  });
  clearTimeout(newtimeout);
});

app.get('/api/getmessagecounts/:page', async (req, res) => {
  const resPerPage = 100; // results per page
  const page = req.params.page || 1; // Page
  const orders = await MessageCounts.find({})
    .sort('-date')
    .skip(resPerPage * page - resPerPage)
    .limit(resPerPage);

  return res.json(orders);
});

// app.get('/api/reportCount', async (req, res) => {
//   // await delay(1000);
// });
app.post('/api/clearLogs', async (req, res) => {
  try {
    NUMBER_OF_SENDS = 0;
    global.DELIVEREDCOUNT = 0;
    global.UNDELIVEREDCOUNT = 0;
    global.ENROUTECOUNT = 0;
    global.SENTSTATUSCOUNT = 0;
    global.FAILEDCOUNT = 0;
    res.json({ success: true });
  } catch (error) {}
});
app.get('/api/checkForFileExistence', async (req, res) => {
  // await delay(1000);
  // res.json({ messageId: uuid() });
  try {
    // let deliveredCount = await Messages.countDocuments({ status: 'DELIVRD' });
    // let unDeliveredCount = await Messages.countDocuments({ status: 'UNDELIV' });
    // let unknownCount = await Messages.countDocuments({ status: 'UNKNOWN' });
    // let rejectedCount = await Messages.countDocuments({ status: 'REJECTD' });
    // let enrouteCount = await Messages.countDocuments({ status: 'ENROUTE' });
    // let sentStatus = await Messages.countDocuments({ status: 'SENT' });
    // let expiredCount = await Messages.countDocuments({ status: 'EXPIRED' });
    // let deletedCount = await Messages.countDocuments({ status: 'DELETED' });
    // let acceptedCount = await Messages.countDocuments({ status: 'ACCEPTD' });
    // let noRouteCount = await Messages.countDocuments({ status: 'NO ROUTES' });

    // res.json({ deliveredCount, unDeliveredCount, unknownCount });
    let file = fsExtra.existsSync('./public/file.csv');
    // const messageCount = await Messages.countDocuments();
    // console.log(messageCount);
    // const fileStatus = await FileName.findOne({});
    // console.log(file);
    if (file) {
      fs.readFile('./public/file.csv', 'utf8', (err, data) => {
        res.json({
          exists: data,
          deliveredCount: DELIVEREDCOUNT,
          // NUMBER_OF_SENDS,
          unDeliveredCount: UNDELIVEREDCOUNT,
          // unknownCount,
          // failed: FAILEDCOUNT,
          rejectedCount: FAILEDCOUNT,
          enrouteCount: ENROUTECOUNT,
          sentStatus: SENTSTATUSCOUNT,
          speed: SENDS_PER_SECOND,
          messageCount: NUMBER_OF_SENDS
          // ...fileStatus
        });
      });
    } else {
      res.json({
        exists: false,
        deliveredCount: DELIVEREDCOUNT,
        // NUMBER_OF_SENDS,
        // failed: FAILEDCOUNT,
        unDeliveredCount: UNDELIVEREDCOUNT,
        speed: SENDS_PER_SECOND,
        // unknownCount,
        rejectedCount: FAILEDCOUNT,
        enrouteCount: ENROUTECOUNT,
        sentStatus: SENTSTATUSCOUNT,
        messageCount: NUMBER_OF_SENDS
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get('/api/testmysends', async (req, res) => {
  // console.log(here);
  let ani = req.query.ani;
  let dnis = req.query.dnis;
  let dnisArray = dnis.trim().split(',');

  let message = req.query.message;
  let results = [];
  console.log(ani, dnisArray, message);
  for (let i = 0; i < dnisArray.length; i++) {
    request(
      `http://163.172.233.88:8002?command=submit&ani=${ani}&dnis=${dnisArray[i]}&username=FreshData2way&password=c4c6bohm&message=${message}`,
      (err, result, body) => {
        console.log(body);
        if (body === 'NO ROUTES') {
          // res.status(400).json({ msg: 'no routes' })
          results.push({
            success: false,
            message_id: 'no routes',
            dnis: dnisArray[i]
          });
        } else {
          // res.json({ msg: JSON.parse(body).message_id });
          results.push({
            success: true,
            message_id: JSON.parse(body).message_id,
            dnis: dnisArray[i]
          });
        }

        console.log(results);
        if (i === dnisArray.length - 1) {
          res.json(results);
        }
      }
    );
  }
});

app.get('/api/status', (req, res) => {
  // let dnisArray = dnis.trim().split(',');

  request(
    `http://163.172.233.88:8002?username=FreshData2way&password=c4c6bohm&messageId=${req.query.message_id}&command=query`,
    function(errQuery, responseQuery, bodyQuery) {
      res.json({
        status: JSON.parse(bodyQuery).status,
        m: req.query.message_id
      });
    }
  );
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    cb(null, 'file.csv');
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
let io = socket(server);

io.on('connection', (socket, id) => {
  // app.get('/api', (req, res) => {
  console.log('connected');
  // res.send('success');
  app.get('/api/downloadnew', async function(req, res) {
    let randomFileName = `./public/file.csv`;
    try {
      res.download(randomFileName); // Set disposition and send it.
      // socket.disconnect();
      await delay(4000);
      // process.exit(1);
    } catch (e) {
      console.log('error');
    }
  });

  // socket.on('upload', async data => {

  // });
  socket.on('kill', async _ => {
    // setImmediate(() => {
    process.nextTick(() => {
      DONOTCONTINUEWITHSEND = true;
      io.sockets.emit('processKilled', true);
      process.exit(1);
    });
    // });
  });
  socket.on('pause', async _ => {
    JSON_UNUSED = JSON_UNUSED.slice(NUMBER_OF_SENDS);
    DONOTCONTINUEWITHSEND = true;
    console.log('pause me now');
    DELAY = 999999;
    var csvUnused = convertJsonToCsv
      .convertArrayOfObjects(JSON_UNUSED, ['phone', 'message'])
      .replace(/["']/g, '');
    fs.writeFile('./public/file.csv', csvUnused, async err => {
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
  // });
  // console.log('here is the id ', socket.id);

  // let newCsv;
  // let intervalGarbage = setInterval(() => {

  // }, 15000);
  socket.on('start', async data => {
    let timeout;
    DELAY = 1000;
    DONOTCONTINUEWITHSEND = false;
    JSON_TO_SLICE = 0;
    const { filename, ani, withLeadingOne } = data;
    if (!ani) {
      return io.sockets.emit('stop', true);
    }

    const startDate = new Date().getTime();

    let jsonArray = await csvtojson().fromFile(`./public/file.csv`);
    console.log(jsonArray);
    // fileNew.totalCount = jsonArray.length;

    // return
    // global.ORIGINAL_LENGTH = jsonArray.length;
    JSON_UNUSED = jsonArray;
    TOTALNUMBER = jsonArray.length;
    io.sockets.emit('totalNumber', jsonArray.length);
    // await delay(1000);
    const statusSwitch = (s, io) => {
      switch (s) {
        case 'DELIVRD':
          DELIVEREDCOUNT += 1;
          return io.sockets.emit(s, DELIVEREDCOUNT);
        case 'UNDELIV':
          UNDELIVEREDCOUNT += 1;
          return io.sockets.emit(s, UNDELIVEREDCOUNT);
        case 'REJECTD':
          FAILEDCOUNT += 1;
          return io.sockets.emit(s, FAILEDCOUNT);
        case 'SENT':
          SENTSTATUSCOUNT += 1;
          return io.sockets.emit(s, SENTSTATUSCOUNT);
        case 'ENROUTE':
          ENROUTECOUNT += 1;
          return io.sockets.emit(s, ENROUTECOUNT);
      }
    };
    for (let i = 0; i < jsonArray.length; i++) {
      if (DONOTCONTINUEWITHSEND) {
        return;
      }

      request(
        `http://163.172.233.88:8001?command=submit&ani=${ani}&dnis=${
          `${jsonArray[i].phone}`[0] == '1' ? '' : '1'
        }${
          jsonArray[i].phone
        }&username=FreshData2way&password=c4c6bohm&message=${
          jsonArray[i].message
        }`,
        // `http://localhost:9090/api/text`,
        function(error, response, body) {
          // console.log(body);
          // console.log(body, response, error, '396');
          NUMBER_OF_SENDS++;
          // JSON_TO_SLICE++;

          try {
            io.sockets.emit('sent', NUMBER_OF_SENDS);
            io.sockets.emit('totalNumber', TOTALNUMBER - NUMBER_OF_SENDS);
            new Timeout(30000).promise().then(resTimer => {
              try {
                request(
                  `http://163.172.233.88:8001?username=FreshData2way&password=c4c6bohm&messageId=${
                    JSON.parse(body).message_id
                  }&command=query`,
                  function(errQuery, responseQuery, bodyQuery) {
                    let status = JSON.parse(bodyQuery).status;
                    statusSwitch(status, io);
                    // io.sockets.emit(status);
                    clearTimeout(resTimer.timeout);
                  }
                );
              } catch (error) {
                // clearTimeout(resTimer.timeout);
                console.log(error, 'From second catch block');
              }

              // statusSwitch('DELIVRD', io);
            });
          } catch (error) {
            console.log(error);
            console.log('no routes');
          }
        }
      );
      // JSON_UNUSED = [...JSON_UNUSED].slice(1);
      // JSON_TO_SLICE++;
      if (i % SENDS_PER_SECOND === 0) {
        console.log('wo');
        let sendTime = await delay(1500);
        clearTimeout(sendTime);
        global.gc();
        global.gc();
        global.gc();
        global.gc();
        global.gc();
        global.gc();
        console.log('gc DONE');
      }
    }
    // clearTimeout(intervalGarbage);
    io.sockets.emit('operationComplete', true);
    JSON_TO_SLICE = 0;
    console.log(
      `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
    );
    fs.unlink('./public/file.csv', (err, data) => {
      console.log('file unlink success');
    });

    console.log('saved');
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
