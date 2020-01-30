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
app.use(cors());
app.use(express.json());

const PORT = 9090;
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function delay(ms) {
  let start = Date.now();
  return new Promise(resolve => setTimeout(resolve, Date.now() + ms - start));
}
connectDB();

let server = app.listen(PORT, function() {
  console.log(`listening to requests on port ${PORT}`);
});

app.get('/api/text', async (req, res) => {
  let newtimeout = await delay(1000);
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
    console.log(req.body);
    const {
      sentCount,
      deliveredCount,
      unDeliveredCount,
      enrouteCount,
      rejectedCount,
      unknownCount,
      sentStatus,
      expiredCount,
      deletedCount,
      acceptedCount
    } = req.body;
    console.log(req.body);
    const newMesage = new MessageCounts({
      sentCount,
      deliveredCount,
      unDeliveredCount,
      enrouteCount,
      rejectedCount,
      unknownCount,
      sentStatus,
      expiredCount,
      deletedCount,
      acceptedCount
    });
    await newMesage.save();
    await Messages.deleteMany({});
    res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'an error occured' });
  }
});
app.get('/api/checkForFileExistence', async (req, res) => {
  // await delay(1000);
  // res.json({ messageId: uuid() });
  try {
    let deliveredCount = await Messages.countDocuments({ status: 'DELIVRD' });
    let unDeliveredCount = await Messages.countDocuments({ status: 'UNDELIV' });
    let unknownCount = await Messages.countDocuments({ status: 'UNKNOWN' });
    let rejectedCount = await Messages.countDocuments({ status: 'REJECTD' });
    let enrouteCount = await Messages.countDocuments({ status: 'ENROUTE' });
    let sentStatus = await Messages.countDocuments({ status: 'SENT' });
    // let expiredCount = await Messages.countDocuments({ status: 'EXPIRED' });
    // let deletedCount = await Messages.countDocuments({ status: 'DELETED' });
    // let acceptedCount = await Messages.countDocuments({ status: 'ACCEPTD' });
    // let noRouteCount = await Messages.countDocuments({ status: 'NO ROUTES' });

    // res.json({ deliveredCount, unDeliveredCount, unknownCount });
    let file = fsExtra.existsSync('./public/file.csv');
    const messageCount = await Messages.countDocuments();
    console.log(messageCount);
    const fileStatus = await FileName.findOne({});
    // console.log(file);
    if (file) {
      fs.readFile('./public/file.csv', 'utf8', (err, data) => {
        res.json({
          exists: data,
          deliveredCount,
          unDeliveredCount,
          rejectedCount,
          unknownCount,
          messageCount,
          enrouteCount,
          sentStatus,
          noRouteCount: 0,
          expiredCount: 0,
          deletedCount: 0,
          acceptedCount: 0,
          ...fileStatus
        });
      });
    } else {
      res.json({
        exists: false,
        deliveredCount,
        rejectedCount,
        unDeliveredCount,
        unknownCount,
        messageCount,
        enrouteCount,
        sentStatus,
        noRouteCount: 0,
        expiredCount: 0,
        deletedCount: 0,
        acceptedCount: 0,
        ...fileStatus
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
      `http://163.172.233.88:8001?command=submit&ani=${ani}&dnis=${dnisArray[i]}&username=FreshData2way&password=c4c6bohm&message=${message}`,
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
    `http://163.172.233.88:8001?username=FreshData2way&password=c4c6bohm&messageId=${req.query.message_id}&command=query`,
    function(errQuery, responseQuery, bodyQuery) {
      res.json({
        status: JSON.parse(bodyQuery).status,
        m: req.query.message_id
      });
    }
  );
});
// app.get('/api/getFileStatus', async (req, res) => {
//   ;
//   if (!fileStatus) {
//     return res.json({ msg: null });
//   }

//   res.json({ ...fileStatus });
// });
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
global.SENDS_PER_SECOND = 10;
global.NUMBER_OF_SENDS = 0;
global.DELAY = 1000;
global.JSON_UNUSED = [];
io.on('connection', (socket, id) => {
  // app.get('/api', (req, res) => {
  console.log('connected');
  // res.send('success');
  app.get('/api/downloadnew', async function(req, res) {
    // let q = req.query.q || 1;
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
    let fileFromDb = await FileName.findOne({ name: 'file.csv' });

    fileFromDb.isSending = false;
    fileFromDb.isPause = false;
    await fileFromDb.save();
    console.log('saved');
    fs.unlink('./public/file.csv', (err, data) => {
      console.log('file unlink success');
      io.sockets.emit('processKilled', true);
      process.exit(1);
    });
  });
  socket.on('pause', async _ => {
    // JSON_UNUSED
    console.log('pause me now');
    global.DELAY = 920000;
    FileName.findOneAndUpdate({}, { isPause: true }, () => {
      console.log('updated');
    });
    // fileStatus.isPause = true;
    //  fileStatus.save((e)=>{
    //   console.log("saved")
    //  });
    const json2csvParser = new Parser({ fields: ['phone', 'message'] });
    const csvUnused = json2csvParser.parse(JSON_UNUSED);
    fs.writeFile('./public/file.csv', csvUnused, async err => {
      // throws an error, you could also catch it here

      io.sockets.emit('pauseDone', csvUnused);
      if (err) throw err;
      console.log('csv saved!');
      await delay(2000);

      process.exit(1);

      // success case, the file was saved
    });
  });
  socket.on('setSpeed', speed => {
    SENDS_PER_SECOND = speed;
  });
  // });
  // console.log('here is the id ', socket.id);

  let newCsv;
  socket.on('start', async data => {
    let timeout;
    DELAY = 1000
    const { filename, ani, withLeadingOne } = data;
    if (!ani) {
      return io.sockets.emit('stop', true);
    }
    // FileName.findOne({name: filename}, (err, data)=> {

    // })
    let fileNew = await FileName.findOne({ name: 'file.csv' });
    fileNew.isSending = true;
    fileNew.isPause = false;
    fileNew.displayName = filename;
    fileNew.phoneNumberSending = ani;
    fileNew.withLeadingOne = withLeadingOne;

    // process the file
    // sendFunctions(fileName);

    const startDate = new Date().getTime();

    let jsonArray = await csvtojson().fromFile(`./public/file.csv`);
    console.log(jsonArray);
    fileNew.totalCount = jsonArray.length;

    fileNew.save(function(err) {
      if (err) return handleError(err);
      // saved!
    });
    // return
    // global.ORIGINAL_LENGTH = jsonArray.length;
    JSON_UNUSED = jsonArray;
    io.sockets.emit('totalNumber', jsonArray.length);
    // await delay(1000);
    for (let i = 0; i < jsonArray.length; i++) {
      // console.log(jsonArray[i]);
      // console.log(
      //   `http://163.172.233.88:800ttttttttt1?command=submit&ani=${ani}&dnis=${
      //     withLeadingOne ? '1' : ''
      //   }${
      //     jsonArray[i].phone
      //   }&username=FreshData2way&password=c4c6bohm&message=${
      //     jsonArray[i].message
      //   }`
      // );
      // console.log(jsonArray[i].message);
      request(
        `http://163.172.233.88:8001?command=submit&ani=${ani}&dnis=${
          withLeadingOne ? '1' : ''
        }${
          jsonArray[i].phone
        }&username=FreshData2way&password=c4c6bohm&message=${
          jsonArray[i].message
        }`,
        // `http://localhost:7000/api/text`,
        function(error, response, body) {
          // console.log(body);
          if (body !== 'NO ROUTES') {
            try {
              // NUMBER_OF_SENDS++;
              // io.sockets.emit('sent', NUMBER_OF_SENDS);
              io.sockets.emit('sent', NUMBER_OF_SENDS);
              var message = new Messages({
                messageId: JSON.parse(body).message_id,
                message: jsonArray[i].message,
                phone: jsonArray[i].phone,
                senderID: ani
              });
              message.save(function(err) {
                if (err) throw err;
                // saved!
                NUMBER_OF_SENDS++;
              });
              new Timeout(17000).promise().then(resTimer => {
                try {
                  request(
                    `http://163.172.233.88:8001?username=FreshData2way&password=c4c6bohm&messageId=${
                      JSON.parse(body).message_id
                    }&command=query`,
                    function(errQuery, responseQuery, bodyQuery) {
                      // console.log(bodyQuery, 'bodyquery');
                      let status = JSON.parse(bodyQuery).status;
                      io.sockets.emit(status);
                      //this is a test
                      // io.sockets.emit('DELIVRD');
                      // io.sockets.emit('UNDELIV');
                      //this is a test

                      Messages.findOneAndUpdate(
                        { messageId: JSON.parse(body).message_id },
                        { status },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log('err on update');
                          }
                          clearTimeout(timeout);
                        }
                      );
                    }
                  );
                } catch (error) {
                  // clearTimeout(resTimer.timeout);
                  console.log(error, 'From second catch block');
                }
              });
            } catch (error) {
              console.log(error);
              console.log('no routes');
              io.sockets.emit('NO ROUTES');
              Messages.findOneAndUpdate(
                { messageId: uuid() },
                { status: 'NO ROUTES' },
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
              console.log(body);
            }
          } else {
          }
        }
      );

      JSON_UNUSED = [...JSON_UNUSED].splice(1);

      if (i % SENDS_PER_SECOND === 0) {
        console.log('wo');
        let sendTime = await delay(DELAY);
        clearTimeout(sendTime);
      }
    }
    io.sockets.emit('operationComplete', true);
    console.log(
      `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
    );
    fs.unlink('./public/file.csv', (err, data) => {
      console.log('file unlink success');
    });
    let fileFromDb = await FileName.findOne({ name: 'file.csv' });

    fileFromDb.isSending = false;
    fileFromDb.isPause = false;
    await fileFromDb.save();
    console.log('saved');
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
