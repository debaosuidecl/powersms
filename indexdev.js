const express = require('express');
const app = express();
require('dotenv').config();
const PhoneFDN2Way1 = require('./models/PhoneFDN2Way1');
let moment = require('moment');
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
let Messages = require('./models/MessagesAccountOne');
let MessageCounts = require('./models/MessageCountsAccountOne');
const { Parser } = require('json2csv');

let FileName = require('./models/FileNameAccountOne');
// let sendFunctions = require('./sendFunctions/sendFunctions');
//

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
let uuid = require('uuid');
// console.log(uuid());
// return;
app.use(cors());
app.use(express.json());

const PORT = 7800;
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
app.get('/api/text2', async (req, res) => {
  let newtimeout = await delay(1000);
  res.send(
    [
      '{"status":"REJECTD"}',
      '{"status": "DELIVERD"}',
      '{"status": "UNDELIVERD"}'
    ][Math.floor(Math.random() * 3)]
  );
  clearTimeout(newtimeout);
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

    // res.json({ deliveredCount, unDeliveredCount, unknownCount });
    const fileStatus = await FileName.findOne({});
    let file = fsExtra.existsSync('./public/file2.csv');
    const messageCount = await Messages.countDocuments();
    console.log(messageCount);
    // console.log(file);
    if (file) {
      fs.readFile('./public/file2.csv', 'utf8', (err, data) => {
        res.json({
          exists: data,
          deliveredCount,
          unDeliveredCount,
          rejectedCount,
          unknownCount,
          messageCount,
          enrouteCount,
          sentStatus,
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
      `http://163.172.233.88:8001?command=submit&ani=${ani}&dnis=${dnisArray[i]}&username=FreshData2way2&password=u1g6cdx5&message=${message}`,
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
    `http://163.172.233.88:8001?username=FreshData2way2&password=u1g6cdx5&messageId=${req.query.message_id}&command=query`,
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
    // console.log(file.filename)
    // console.log(file);
    cb(null, `${file.originalname}`);
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 999999999 }
}).array('file');
app.post('/api/upload', (req, res) => {
  upload(req, res, async function(err) {
    console.log(err);
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    let fileListArray = req.files.map(f => f.filename);

    FileName.findOneAndUpdate(
      {},
      { $set: { fileList: fileListArray } },
      (err, data) => {
        console.log(req.files);
        res.send('success');
      }
    );
    var count = 0;
    for (let j = 0; j < fileListArray.length; j++) {
      var i;

      require('fs')
        .createReadStream(`./public/${fileListArray[j]}`)
        .on('data', function(chunk) {
          for (i = 0; i < chunk.length; i++) if (chunk[i] == 10) count++;
        })
        .on('end', function() {
          console.log(count, 'the count');
          TOTALFILECOUNT = count;
        });
    }
    // console.log(count, ' is the count');

    //  res.status(200).send(req.file)
  });
});
let io = socket(server);
global.SENDS_PER_SECOND = 10;
global.NUMBER_OF_SENDS = 0;
global.DELAY = 1500;
global.TOTALFILECOUNT = 0;
global.JSON_UNUSED = [];
io.on('connection', (socket, id) => {
  // app.get('/api', (req, res) => {
  console.log('connected');
  // res.send('success');
  app.get('/api/downloadnew', async function(req, res) {
    // let q = req.query.q || 1;
    let randomFileName = `./public/file2.csv`;
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
    let fileFromDb = await FileName.findOne({});

    fileFromDb.isSending = false;
    fileFromDb.isPause = false;
    await fileFromDb.save();
    console.log('saved');
    io.sockets.emit('processKilled', true);
    process.exit(1);

    // fs.unlink(`./public/file2.csv', (err, data) => {
    //   console.log('file unlink success');
    //   io.sockets.emit('processKilled', true);
    // });
  });
  socket.on('pause', async _ => {
    // JSON_UNUSED
    console.log('pause me now');
    global.DELAY = 920000;
    FileName.findOneAndUpdate({}, { isPause: true }, () => {
      console.log('updated');
    });
    // const fileStatus = await FileName.findOne({});
    // fileStatus.isPause = true;
    // await fileStatus.save();
    const json2csvParser = new Parser({ fields: ['phone', 'message'] });
    const csvUnused = json2csvParser.parse(JSON_UNUSED);
    io.sockets.emit('pauseDone', csvUnused);
    let fileName = await FileName.findOne({});
    fs.writeFile(`./public/${fileName.fileList[0]}`, csvUnused, async err => {
      // throws an error, you could also catch it here

      if (err) throw err;
      console.log('csv saved!');
      // await delay(2000);
      // process.exit(1);/

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
    // let timeout;
    io.sockets.emit('totalNumber', TOTALFILECOUNT);

    const { filename, ani, withLeadingOne } = data;
    if (!ani) {
      return io.sockets.emit('stop', true);
    }

    await messageSendingFunction(io, withLeadingOne, filename, ani);
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function messageSendingFunction(io, withLeadingOne, filename, ani) {
  let fileNew = await FileName.findOne();
  fileNew.isSending = true;
  fileNew.isPause = false;
  fileNew.displayName = filename;
  fileNew.phoneNumberSending = ani;
  fileNew.withLeadingOne = withLeadingOne;

  if (fileNew.fileList.length <= 0) {
    return io.sockets.emit('stop', true);
  }
  // process the file
  // sendFunctions(fileName);
  console.log(fileNew.fileList[0], 'fileNew, 375');

  const startDate = new Date().getTime();
  // global.ORIGINAL_LENGTH = jsonArray.length;
  let preJsonArray = [];
  try {
    preJsonArray = await csvtojson().fromFile(
      `./public/${fileNew.fileList[0]}`
    );
  } catch (error) {
    console.log("file doesn't exist");
    return io.sockets.emit('stop', true);
  }
  let supression = await csvtojson().fromFile('supression.csv');

  console.log(supression.length, preJsonArray.length);

  let start = Date.now();
  let seenForSuppression = {};
  let suppresionUniqueLength = [...supression.map(p => p.phone)].filter(p => {
    return seenForSuppression.hasOwnProperty(`${p}`)
      ? false
      : (seenForSuppression[`${p}`] = true);
  }).length;

  console.log(suppresionUniqueLength, 'length of new suppression list');

  let seenForAll = {};
  let uniquePhoneList = [
    ...supression.map(p => p.phone),
    ...preJsonArray.map(p => p.phone)
  ]
    .filter(p => {
      return seenForAll.hasOwnProperty(`${p}`)
        ? false
        : (seenForAll[`${p}`] = true);
    })
    .slice(suppresionUniqueLength);

  console.log(uniquePhoneList.length, 'completely scraped phone list');
  let seenForPhonesToSend = {};
  uniquePhoneList = uniquePhoneList.filter(p => {
    return seenForPhonesToSend.hasOwnProperty(`${p}`)
      ? false
      : (seenForPhonesToSend[`${p}`] = 1);
  });
  // console.log(seenForPhonesToSend);
  let jsonArray = preJsonArray.filter(d => {
    if (
      seenForPhonesToSend.hasOwnProperty(d.phone) &&
      seenForPhonesToSend[d.phone] === 1
    ) {
      seenForPhonesToSend[d.phone]++;
      return true;
    }
    // return d
    return false;
  });
  console.log(jsonArray.length, jsonArray, 'jsonArray');
  console.log(Date.now() - start);
  // return;
  fileNew.totalCount = TOTALFILECOUNT;
  fileNew.save(function(err) {
    if (err) return handleError(err);
    // saved!
  });
  // return

  JSON_UNUSED = jsonArray;
  // await delay(5000);
  for (let i = 0; i < jsonArray.length; i++) {
    const randomAni = { phone: '123456780' };

    request(
      // `http://163.172.233.88:8001?command=submit&ani=0123456789&dnis=${
      //   withLeadingOne ? '1' : ''
      // }${
      //   jsonArray[i].phone
      // }&username=FreshData2way2&password=u1g6cdx5&message=${
      //   jsonArray[i].message
      // }`,
      `http://localhost:7800/api/text`,
      function(error, response, body) {
        // console.log(body);
        if (body !== 'NO ROUTES') {
          try {
            // NUMBER_OF_SENDS++;
            // io.sockets.emit('sent', NUMBER_OF_SENDS);
            // console.log({
            //   messageId: JSON.parse(body).message_id,
            //   message: jsonArray[i].message,
            //   phone: jsonArray[i].phone,
            //   senderID: '123455633434'
            // });
            var message = new Messages({
              messageId: JSON.parse(body).message_id,
              message: jsonArray[i].message,
              phone: jsonArray[i].phone,
              senderID: '123455633434'
            });
            message.save(function(err) {
              if (err) throw err;
              // saved!
              NUMBER_OF_SENDS++;

              io.sockets.emit('sent', NUMBER_OF_SENDS);
              new Timeout(35000).promise().then(resTimer => {
                try {
                  request(
                    // `http://163.172.233.88:8001?username=FreshData2way2&password=u1g6cdx5&messageId=${
                    //   JSON.parse(body).message_id
                    // }&command=query`,
                    'http://localhost:7800/api/text2',
                    function(errQuery, responseQuery, bodyQuery) {
                      let status = JSON.parse(bodyQuery).status;
                      // console.log(status, 'from line 375 I got');
                      io.sockets.emit(status);

                      Messages.findOneAndUpdate(
                        { messageId: JSON.parse(body).message_id },
                        { status },
                        { new: true },
                        (err, doc) => {
                          if (err) {
                            console.log(err);
                          }
                          // clearTimeout(resTimer.timeout);

                          // clearTimeout(timeout);
                        }
                      );
                    }
                  );
                } catch (error) {
                  // clearTimeout(timeout);
                  console.log(error, 'From second catch block');
                }
              });
              // timeout = setTimeout(() => {}, 35000);
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log(body);
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

  console.log(
    `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
  );
  let fileFromDb = await FileName.findOne();

  try {
    fs.unlink(`./public/${fileFromDb.fileList[0]}`, (err, data) => {
      console.log('file unlink success');
    });
  } catch (error) {
    console.log(error);
  }
  fileFromDb.fileList = fileFromDb.fileList.slice(1);
  fileFromDb.isSending = false;
  fileFromDb.isPause = false;
  await fileFromDb.save();
  console.log('saved');
  if (fileFromDb.fileList.length > 0) {
    io.sockets.emit('removeFileFromSendStatus', true);
    await messageSendingFunction(io, withLeadingOne, filename, fileFromDb.ani);
  } else {
    io.sockets.emit('operationComplete', true);
  }
}
