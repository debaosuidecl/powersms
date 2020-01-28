// const express = require('express');
// const app = express();
// require('dotenv').config();
// const path = require('path');
// let socket = require('socket.io');
// const connectDB = require('./config/db.js');
// let cors = require('cors');
// let multer = require('multer');
// let request = require('request');
// let csvtojson = require('csvtojson');
// let fs = require('fs');
// let fsExtra = require('fs-extra');
// let csv = require('csv-parser');
// let Messages = require('./modelsForMobiniti/Messages');
// const { Parser } = require('json2csv');

// let FileName = require('./modelsForMobiniti/FileName');
// // let sendFunctions = require('./sendFunctions/sendFunctions');
// // let
// let uuid = require('uuid');
// // console.log(uuid());
// // return;
// app.use(cors());
// const PORT = 9000;
// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// connectDB();

// let server = app.listen(PORT, function() {
//   console.log(`listening to requests on port ${PORT}`);
// });

// app.get('/api/text', async (req, res) => {
//   let newtimeout = await delay(1000);
//   res.json({ data: 'Success "c723d42a-c3ee-452c-940b-3d8e8b944868' });
//   clearTimeout(newtimeout);
// });
// // app.get('/api/reportCount', async (req, res) => {
// //   // await delay(1000);
// // });
// app.get('/api/checkForFileExistence', async (req, res) => {
//   // await delay(1000);
//   // res.json({ messageId: uuid() });
//   try {
//     let deliveredCount = await Messages.countDocuments({ status: 'DELIVRD' });
//     let unDeliveredCount = await Messages.countDocuments({ status: 'UNDELIV' });
//     let unknownCount = await Messages.countDocuments({ status: 'UNKNOWN' });
//     // res.json({ deliveredCount, unDeliveredCount, unknownCount });
//     let file = fsExtra.existsSync('./public/file.csv');
//     const messageCount = await Messages.countDocuments();
//     console.log(messageCount);
//     const fileStatus = await FileName.findOne({});
//     // console.log(file);
//     if (file) {
//       fs.readFile('./public/file.csv', 'utf8', (err, data) => {
//         res.json({
//           exists: data,
//           deliveredCount,
//           unDeliveredCount,
//           unknownCount,
//           messageCount,
//           ...fileStatus
//         });
//       });
//     } else {
//       res.json({
//         exists: false,
//         deliveredCount,
//         unDeliveredCount,
//         unknownCount,
//         messageCount,
//         ...fileStatus
//       });
//     }
//   } catch (e) {
//     console.log(e);
//   }
// });

// app.get('/api/testmysends', async (req, res) => {
//   // console.log(here);
//   let ani = req.query.ani;
//   let dnis = req.query.dnis;
//   let dnisArray = dnis.trim().split(',');

//   let message = req.query.message;
//   let results = [];
//   console.log(ani, dnisArray, message);
//   for (let i = 0; i < dnisArray.length; i++) {
//     request(
//       `http://163.172.233.88:8001?command=submit&ani=${ani}&dnis=1${dnisArray[i]}&username=FreshDataTFN&password=bc3k6d7y&message=${message}`,
//       (err, result, body) => {
//         console.log(body);
//         if (body === 'NO ROUTES') {
//           // res.status(400).json({ msg: 'no routes' })
//           results.push({
//             success: false,
//             message_id: 'no routes',
//             dnis: dnisArray[i]
//           });
//         } else {
//           // res.json({ msg: JSON.parse(body).message_id });
//           results.push({
//             success: true,
//             message_id: JSON.parse(body).message_id,
//             dnis: dnisArray[i]
//           });
//         }

//         console.log(results);
//         if (i === dnisArray.length - 1) {
//           res.json(results);
//         }
//       }
//     );
//   }
// });

// app.get('/api/status', (req, res) => {
//   // let dnisArray = dnis.trim().split(',');

//   request(
//     `http://163.172.233.88:8001?username=FreshDataTFN&password=bc3k6d7y&messageId=${req.query.message_id}&command=query`,
//     function(errQuery, responseQuery, bodyQuery) {
//       res.json({
//         status: JSON.parse(bodyQuery).status,
//         m: req.query.message_id
//       });
//     }
//   );
// });

// var storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'publicForMobiniti');
//   },
//   filename: function(req, file, cb) {
//     cb(null, 'file.csv');
//   }
// });
// var numberStorage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'publicForMobiniti');
//   },
//   filename: function(req, file, cb) {
//     cb(null, 'phone.csv');
//   }
// });

// var upload = multer({ storage: storage }).single('file');
// var uploadNumbers = multer({ storage: numberStorage }).single('phone');

// app.post('/api/upload', (req, res) => {
//   upload(req, res, async function(err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     console.log(req.file);
//     res.send('success');
//     //  res.status(200).send(req.file)
//   });
// });

// app.post('/api/uploadphones', (req, res) => {
//   upload(req, res, async function(err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(500).json(err);
//     } else if (err) {
//       return res.status(500).json(err);
//     }
//     console.log(req.file);
//     res.send('success');
//     //  res.status(200).send(req.file)
//   });
// });
// let io = socket(server);
// global.SENDS_PER_SECOND = 10;
// global.NUMBER_OF_SENDS = 0;
// global.JSON_FOR_PHONE_UNUSED = [];
// global.DELAY = 1000;
// global.JSON_UNUSED = [];
// io.on('connection', (socket, id) => {
//   // app.get('/api', (req, res) => {
//   console.log('connected');
//   // res.send('success');
//   app.get('/api/downloadnew', async function(req, res) {
//     // let q = req.query.q || 1;
//     let randomFileName = `./public/file.csv`;
//     try {
//       res.download(randomFileName); // Set disposition and send it.
//       // socket.disconnect();
//       await delay(4000);
//       // process.exit(1);
//     } catch (e) {
//       console.log('error');
//     }
//   });

//   socket.on('kill', async _ => {
//     let fileFromDb = await FileName.findOne({ name: 'file.csv' });

//     fileFromDb.isSending = false;
//     fileFromDb.isPause = false;
//     await fileFromDb.save();
//     console.log('saved');
//     fs.unlink('./publicForMobiniti/file.csv', (err, data) => {
//       fs.unlink('./publicForMobiniti/phone.csv', (err, data) => {
//         console.log('file unlink success');
//         io.sockets.emit('processKilled', true);
//         process.exit(1);
//       });
//     });
//   });
//   socket.on('pause', async _ => {
//     // JSON_UNUSED
//     console.log('pause me now');
//     global.DELAY = 820000;
//     const fileStatus = await FileName.findOne({});
//     fileStatus.isPause = true;
//     await fileStatus.save();
//     const json2csvParser = new Parser({ fields: ['phone', 'message'] });
//     const json2csvParserForPhone = new Parser({ fields: ['phone'] });
//     const csvUnused = json2csvParser.parse(JSON_UNUSED);
//     const csvForPhoneUnused = json2csvParserForPhone.parser(
//       JSON_FOR_PHONE_UNUSED
//     );
//     fs.writeFile('./publicForMobiniti/file.csv', csvUnused, async err => {
//       // throws an error, you could also catch it here
//       fs.writeFile(
//         './publicForMobiniti/phone.csv',
//         csvForPhoneUnused,
//         async err => {
//           io.sockets.emit('pauseDone', { csvUnused, csvForPhoneUnused });
//           if (err) throw err;
//           console.log('csv saved!');
//           await delay(2000);
//           process.exit(1);
//         }
//       );

//       // success case, the file was saved
//     });
//   });
//   socket.on('setSpeed', speed => {
//     SENDS_PER_SECOND = speed;
//   });
//   // });
//   // console.log('here is the id ', socket.id);

//   let newCsv;
//   let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJmN2FiY2VmZTJmMDU4M2E4M2Y5MmM1NDkyYWNlMGQ5Mjk1ODNiZjhlYTVjOGI1MTQzZDQwMzYxNzJhMTA1Y2Y0ZTI4OTY0ZTk4Y2NhYTZiIn0.eyJhdWQiOiI2NCIsImp0aSI6ImJmN2FiY2VmZTJmMDU4M2E4M2Y5MmM1NDkyYWNlMGQ5Mjk1ODNiZjhlYTVjOGI1MTQzZDQwMzYxNzJhMTA1Y2Y0ZTI4OTY0ZTk4Y2NhYTZiIiwiaWF0IjoxNTc5MDI2NDc0LCJuYmYiOjE1NzkwMjY0NzQsImV4cCI6MTg5NDY0NTY3NCwic3ViIjoiODg4NCIsInNjb3BlcyI6WyJjYW1wYWlnbnMuY3JlYXRlIiwiY2FtcGFpZ25zLmRlbGV0ZSIsImNhbXBhaWducy51cGRhdGUiLCJjYW1wYWlnbnMudmlldyIsImNhbXBhaWducy50ZW1wbGF0ZXMuY3JlYXRlIiwiY2FtcGFpZ25zLnRlbXBsYXRlcy5kZWxldGUiLCJjYW1wYWlnbnMudGVtcGxhdGVzLnVwZGF0ZSIsImNhbXBhaWducy50ZW1wbGF0ZXMudmlldyIsImNvbnRhY3RzLmNyZWF0ZSIsImNvbnRhY3RzLmRlbGV0ZSIsImNvbnRhY3RzLnVwZGF0ZSIsImNvbnRhY3RzLnZpZXciLCJjb250YWN0cy5pbXBvcnRzLnZpZXciLCJjb3Vwb25zLmNyZWF0ZSIsImNvdXBvbnMuZGVsZXRlIiwiY291cG9ucy51cGRhdGUiLCJjb3Vwb25zLnZpZXciLCJncm91cHMuY3JlYXRlIiwiZ3JvdXBzLmRlbGV0ZSIsImdyb3Vwcy51cGRhdGUiLCJncm91cHMudmlldyIsIm1lc3NhZ2VzLmNyZWF0ZSIsIm1lc3NhZ2VzLnVucmVhZC52aWV3IiwibWVzc2FnZXMudXBkYXRlIiwibWVzc2FnZXMudmlldyIsIm9wdGlucy52aWV3IiwidXNlci5jdXN0b21fZmllbGRzLnZpZXciLCJwaG9uZS1udW1iZXJzLmxvb2t1cCIsInRyYWNraW5nLXBpeGVsLmNyZWF0ZSIsInRyYWNraW5nLXBpeGVsLmRlbGV0ZSIsInRyYWNraW5nLXBpeGVsLnVwZGF0ZSIsInRyYWNraW5nLXBpeGVsLnZpZXciLCJjYXJyaWVycy52aWV3Il19.WxoGtEy4W1asisTbFNdrH2ZS-DJAQm7SetQgBq1ymzk5DYNF8Csx-ktVr55sOHLGheQJSu8yILGlN-poS2jvrN3-g6tta1TmTeadUvOVu_4YdemPvCpT_YNPa4bzNCvAwEIIrm91CLauuHny6TVtrclIg5Z2DQlU2E8_crdEo77vuHYBsfchfbx2T-9uH_d4lex5cSMN_i_aiRQtQm15gTMBx8IV461xm0_Q07ow8wDz-2mzV6Lpu6vw-97MeiibSF2C90pqEMu5sjAi4ikhEcYlyUktQnb5iBvarQThOAUUFKobBTl9eXGWGvbnymcr6-ZwCcGNOTSwe1O36NLd-29JHomT3eiktly6KXDydSALiOj6LQtQAPIuQjNxvU9CR3FGpwIV14J32qzIPmAhfaU1I5-PAUMHzkfTTQC5SYXNEmkEQ2uOaCo7tByNIiLL6QOyh657M09Evd859hgv4TJP-fItEl-mCQeHiEpj9myn0h7QBlAQnrujb15nM2XM4humG-mX7SVQ84F-XYAUWZvEn_vl8S4op72ZS9NK3PHRrNHrokR8w8KtlsRyY4KhEypUXO8PmAb0-i_Gw8woExoUpEFRiuFf40CEGfHOrj7dRuh-Dv1b5qqccEHW8HqGhPnqnlNzXDdsDAAiiVrefw0UNZ_2iyWcva7PF7EkSdY`;
//   // app.get('/api/delivery/:phoneNumber', (req, res) => {
//   //   // console.log(req.query);
//   //   console.log(req.params);

//   //   res.json(req.query);
//   // });
//   socket.on('start', async data => {
//     let timeout;

//     const { filename, withLeadingOne, phoneFile } = data;
//     // if (!ani) {
//     //   return io.sockets.emit('stop', true);
//     // }

//     let fileNew = await FileName.findOne({ name: 'file.csv' });
//     fileNew.isSending = true;
//     fileNew.isPause = false;
//     fileNew.displayName = filename;
//     fileNew.phoneFileName = phoneFile;
//     fileNew.phoneNumberSending = ani;
//     fileNew.withLeadingOne = withLeadingOne;
//     fileNew.save(function(err) {
//       if (err) return handleError(err);
//       // saved!
//     });
//     // process the file
//     // sendFunctions(fileName);

//     const startDate = new Date().getTime();

//     let jsonArray = await csvtojson().fromFile(`./publicForMobiniti/file.csv`);
//     let jsonPhoneArray = await csvtojson().fromFile(
//       `./publicForMobiniti/phone.csv`
//     );
//     // let phoneNumberJsonArray = await csvtojson().fromFile(
//     //   './public/numbers.csv'
//     // );
//     JSON_UNUSED = jsonArray;
//     JSON_FOR_PHONE_UNUSED = jsonPhoneArray;

//     for (let i = 0; i < jsonArray.length; i++) {
//       request.post(
//         `https://api.mobiniti.com/v1/message`,
//         {
//           // json: true,
//           json:
//             //  JSON.stringify(
//             {
//               phone_number: `+${
//                 withLeadingOne ? '1' + jsonArray[i].phone : jsonArray[i].phone
//               }`,
//               message: jsonArray[i].message,
//               from: `+${jsonPhoneArray[i].phone}`
//             },

//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           method: 'POST'
//         },
//         // `http://localhost:7000/api/text`,
//         function(error, response, body) {
//           // console.log(JSON.parse(body))
//           // console.log(body);
//           // console.log
//           // console.log(body);
//           // if (body !== 'NO ROUTES') {
//           try {
//             // NUMBER_OF_SENDS++;
//             // io.sockets.emit('sent', NUMBER_OF_SENDS);
//             var message = new Messages({
//               messageId: JSON.parse(body).data,
//               message: jsonArray[i].message,
//               phone: jsonArray[i].phone,
//               senderID: ani
//             });
//             message.save(function(err) {
//               if (err) throw err;
//               // saved!
//               NUMBER_OF_SENDS++;

//               io.sockets.emit('sent', NUMBER_OF_SENDS);
//               // timeout = setTimeout(() => {
//               //   try {
//               //     request(
//               //       `${
//               //         process.env.NODE_ENV === 'production'
//               //           ? '159.89.55.0'
//               //           : 'localhost'
//               //       }:8080/api/delivery/${jsonArray[i].phone}`,
//               //       function(errQuery, responseQuery, bodyQuery) {
//               //         console.log(bodyQuery);
//               //         // let status = JSON.parse(bodyQuery).status;
//               //         return;
//               //         io.sockets.emit(status);

//               //         Messages.findOneAndUpdate(
//               //           { messageId: JSON.parse(body).data },
//               //           { status },
//               //           { new: true },
//               //           (err, doc) => {
//               //             if (err) {
//               //               console.log(err);
//               //             }
//               //             clearTimeout(timeout);
//               //           }
//               //         );
//               //       }
//               //     );
//               //   } catch (error) {
//               //     clearTimeout(timeout);
//               //     console.log(error, 'From second catch block');
//               //   }
//               // }, 30000);
//             });
//           } catch (error) {
//             console.log(error);
//           }
//           // }
//         }
//       );

//       JSON_UNUSED = [...JSON_UNUSED].splice(1);
//       JSON_FOR_PHONE_UNUSED = [...JSON_FOR_PHONE_UNUSED].splice(1);

//       if (i % SENDS_PER_SECOND === 0) {
//         console.log('wo');
//         let sendTime = await delay(DELAY);
//         clearTimeout(sendTime);
//       }
//     }
//     io.sockets.emit('operationComplete', true);
//     console.log(
//       `Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`
//     );
//     fs.unlink('./publicForMobiniti/file.csv', (err, data) => {
//       console.log('file unlink success');
//     });
//     fs.unlink('./publicForMobiniti/phone.csv', (err, data) => {
//       console.log('file unlink success');
//     });
//     let fileFromDb = await FileName.findOne({ name: 'file.csv' });

//     fileFromDb.isSending = false;
//     fileFromDb.isPause = false;
//     await fileFromDb.save();
//     console.log('saved');
//   });
// });

// // if (process.env.NODE_ENV === 'production') {
// //   app.use(express.static('client/build'));
// //   app.get('*', (req, res) => {
// //     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// //   });
// // }

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
let Messages = require('./modelsForMobiniti/Messages');
const { Parser } = require('json2csv');
const convertJsonToCsv = require('convert-json-to-csv');

let FileName = require('./modelsForMobiniti/FileName');
// let sendFunctions = require('./sendFunctions/sendFunctions');
// let
let uuid = require('uuid');
// console.log(uuid());
// return;
app.use(cors());
const PORT = 9000;
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
connectDB();

let server = app.listen(PORT, function() {
  console.log(`listening to requests on port ${PORT}`);
});

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
app.get('/api/checkForFileExistence', async (req, res) => {
  // await delay(1000);
  // res.json({ messageId: uuid() });
  try {
    let deliveredCount = await Messages.countDocuments({ status: 'DELIVRD' });
    let unDeliveredCount = await Messages.countDocuments({ status: 'UNDELIV' });
    let unknownCount = await Messages.countDocuments({ status: 'UNKNOWN' });
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
          unknownCount,
          messageCount,
          ...fileStatus
        });
      });
    } else {
      res.json({
        exists: false,
        deliveredCount,
        unDeliveredCount,
        unknownCount,
        messageCount,
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
      `http://163.172.233.88:8001?command=submit&ani=${ani}&dnis=1${dnisArray[i]}&username=FreshDataTFN&password=bc3k6d7y&message=${message}`,
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
    `http://163.172.233.88:8001?username=FreshDataTFN&password=bc3k6d7y&messageId=${req.query.message_id}&command=query`,
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
    cb(null, 'publicForMobiniti');
  },
  filename: function(req, file, cb) {
    cb(null, 'file.csv');
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
global.SENDS_PER_SECOND = 10;
global.NUMBER_OF_SENDS = 0;
global.DELAY = 1000;
global.IS_TEST = true;
global.DONOTCONTINUEWITHSEND = false;
global.JSON_FOR_PHONE_UNUSED = [];
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

  socket.on('kill', async _ => {
    let fileFromDb = await FileName.findOne({ name: 'file.csv' });

    fileFromDb.isSending = false;
    fileFromDb.isPause = false;
    await fileFromDb.save();
    console.log('saved');
    fs.unlink('./publicForMobiniti/file.csv', (err, data) => {
      // fs.unlink('./publicForMobiniti')
      console.log('file unlink success');
      io.sockets.emit('processKilled', true);

      process.exit(1);
    });
  });
  socket.on('pause', async _ => {
    DONOTCONTINUEWITHSEND = true;
    console.log('pause me now');
    DELAY = 999999;
    const fileStatus = await FileName.findOne({});
    fileStatus.isPause = true;
    await fileStatus.save();

    var csvUnused = convertJsonToCsv
      .convertArrayOfObjects(JSON_UNUSED, ['phone', 'message'])
      .replace(/["']/g, '');
    var csvForPhoneUnused = convertJsonToCsv
      .convertArrayOfObjects(JSON_FOR_PHONE_UNUSED, ['phone'])
      .replace(/["']/g, '');
    // const json2csvParserForPhone = new Parser({ fields: ['phone'] });

    fs.writeFile('./publicForMobiniti/file.csv', csvUnused, async err => {
      // throws an error, you could also catch it here
      fs.writeFile(
        './publicForMobiniti/phone.csv',
        csvForPhoneUnused,
        async err => {
          io.sockets.emit('pauseDone', csvUnused);
          if (err) throw err;
          console.log('csv saved!');
          await delay(2000);
          // process.exit(1);
        }
      );
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

  let newCsv;
  // let token = `aGVsbDIxNDY6WmdUVERaUXU=`;
  let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJmN2FiY2VmZTJmMDU4M2E4M2Y5MmM1NDkyYWNlMGQ5Mjk1ODNiZjhlYTVjOGI1MTQzZDQwMzYxNzJhMTA1Y2Y0ZTI4OTY0ZTk4Y2NhYTZiIn0.eyJhdWQiOiI2NCIsImp0aSI6ImJmN2FiY2VmZTJmMDU4M2E4M2Y5MmM1NDkyYWNlMGQ5Mjk1ODNiZjhlYTVjOGI1MTQzZDQwMzYxNzJhMTA1Y2Y0ZTI4OTY0ZTk4Y2NhYTZiIiwiaWF0IjoxNTc5MDI2NDc0LCJuYmYiOjE1NzkwMjY0NzQsImV4cCI6MTg5NDY0NTY3NCwic3ViIjoiODg4NCIsInNjb3BlcyI6WyJjYW1wYWlnbnMuY3JlYXRlIiwiY2FtcGFpZ25zLmRlbGV0ZSIsImNhbXBhaWducy51cGRhdGUiLCJjYW1wYWlnbnMudmlldyIsImNhbXBhaWducy50ZW1wbGF0ZXMuY3JlYXRlIiwiY2FtcGFpZ25zLnRlbXBsYXRlcy5kZWxldGUiLCJjYW1wYWlnbnMudGVtcGxhdGVzLnVwZGF0ZSIsImNhbXBhaWducy50ZW1wbGF0ZXMudmlldyIsImNvbnRhY3RzLmNyZWF0ZSIsImNvbnRhY3RzLmRlbGV0ZSIsImNvbnRhY3RzLnVwZGF0ZSIsImNvbnRhY3RzLnZpZXciLCJjb250YWN0cy5pbXBvcnRzLnZpZXciLCJjb3Vwb25zLmNyZWF0ZSIsImNvdXBvbnMuZGVsZXRlIiwiY291cG9ucy51cGRhdGUiLCJjb3Vwb25zLnZpZXciLCJncm91cHMuY3JlYXRlIiwiZ3JvdXBzLmRlbGV0ZSIsImdyb3Vwcy51cGRhdGUiLCJncm91cHMudmlldyIsIm1lc3NhZ2VzLmNyZWF0ZSIsIm1lc3NhZ2VzLnVucmVhZC52aWV3IiwibWVzc2FnZXMudXBkYXRlIiwibWVzc2FnZXMudmlldyIsIm9wdGlucy52aWV3IiwidXNlci5jdXN0b21fZmllbGRzLnZpZXciLCJwaG9uZS1udW1iZXJzLmxvb2t1cCIsInRyYWNraW5nLXBpeGVsLmNyZWF0ZSIsInRyYWNraW5nLXBpeGVsLmRlbGV0ZSIsInRyYWNraW5nLXBpeGVsLnVwZGF0ZSIsInRyYWNraW5nLXBpeGVsLnZpZXciLCJjYXJyaWVycy52aWV3Il19.WxoGtEy4W1asisTbFNdrH2ZS-DJAQm7SetQgBq1ymzk5DYNF8Csx-ktVr55sOHLGheQJSu8yILGlN-poS2jvrN3-g6tta1TmTeadUvOVu_4YdemPvCpT_YNPa4bzNCvAwEIIrm91CLauuHny6TVtrclIg5Z2DQlU2E8_crdEo77vuHYBsfchfbx2T-9uH_d4lex5cSMN_i_aiRQtQm15gTMBx8IV461xm0_Q07ow8wDz-2mzV6Lpu6vw-97MeiibSF2C90pqEMu5sjAi4ikhEcYlyUktQnb5iBvarQThOAUUFKobBTl9eXGWGvbnymcr6-ZwCcGNOTSwe1O36NLd-29JHomT3eiktly6KXDydSALiOj6LQtQAPIuQjNxvU9CR3FGpwIV14J32qzIPmAhfaU1I5-PAUMHzkfTTQC5SYXNEmkEQ2uOaCo7tByNIiLL6QOyh657M09Evd859hgv4TJP-fItEl-mCQeHiEpj9myn0h7QBlAQnrujb15nM2XM4humG-mX7SVQ84F-XYAUWZvEn_vl8S4op72ZS9NK3PHRrNHrokR8w8KtlsRyY4KhEypUXO8PmAb0-i_Gw8woExoUpEFRiuFf40CEGfHOrj7dRuh-Dv1b5qqccEHW8HqGhPnqnlNzXDdsDAAiiVrefw0UNZ_2iyWcva7PF7EkSdY`;
  app.get('/api/delivery/:phoneNumber', (req, res) => {
    // console.log(req.query);
    console.log(req.params);

    res.json(req.query);
  });
  socket.on('start', async data => {
    DELAY = 2000;
    let timeout;

    const { filename, ani, withLeadingOne } = data;
    if (!ani) {
      return io.sockets.emit('stop', true);
    }

    let fileNew = await FileName.findOne({});
    fileNew.isSending = true;
    fileNew.isPause = false;
    fileNew.displayName = filename;
    fileNew.phoneNumberSending = ani;
    fileNew.withLeadingOne = withLeadingOne;
    fileNew.save(function(err) {
      if (err) return handleError(err);
      // saved!
    });
    const startDate = new Date().getTime();

    let jsonArray = await csvtojson().fromFile(`./publicForMobiniti/file.csv`);
    let jsonPhoneArray = await csvtojson().fromFile(
      `./publicForMobiniti/phone.csv`
    );
    // let phoneNumberJsonArray = await csvtojson().fromFile(
    //   './public/numbers.csv'
    // );
    JSON_UNUSED = jsonArray;
    JSON_FOR_PHONE_UNUSED = jsonPhoneArray;
    sendMessages(
      jsonArray,
      jsonPhoneArray,
      SENDS_PER_SECOND,
      token,
      startDate,
      withLeadingOne
    );
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const objectReturn = (phone_numbersList, dids, speed) => {
  let obj = {};
  for (let i = 0; i < speed; i++) {
    obj = {
      ...obj,
      [phone_numbersList[i]]: dids[i]
    };
  }
  return obj;
};
const sendMessages = async (
  jsonArray,
  jsonPhoneArray,
  sendSpeed,
  token,
  startDate,
  theUserDidNotEnterPhoneNumberWithLeadingOne
) => {
  // console.log(jsonArray.map(group => group.phone).slice(0, sendSpeed));
  // console.log(jsonArray[0].message);
  let phoneNumbersForIteration = jsonArray
    .map(group =>
      theUserDidNotEnterPhoneNumberWithLeadingOne
        ? `1${group.phone}`
        : `${group.phone}`
    )
    .slice(0, sendSpeed);
  let dids = jsonPhoneArray.map(group => group.phone).slice(0, sendSpeed);
  let objectDestinationFrom = objectReturn(
    phoneNumbersForIteration,
    dids,
    sendSpeed
  );
  console.log(objectDestinationFrom);
  request(
    {
      uri: `https://api.mobiniti.com/v1/message/batch`,

      json: JSON.stringify({
        messages: [
          {
            // to: jsonArray.map(group => group.phone).slice(0, sendSpeed),
            // content: jsonArray[1].message,
            // from: 'D7sms'
            message: jsonArray[0].message,
            phone_numbers: phoneNumbersForIteration,
            from: objectDestinationFrom
          }
        ]
      }),
      headers: {
        Authorization: `Bearer ${token}`,
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

        Messages.insertMany(docs, function(err) {
          if (err) console.log(err);
          io.sockets.emit('sent', docs.length);
        });
      } catch (error) {
        console.log(error);
      }
    }
  );

  JSON_UNUSED = [...JSON_UNUSED].slice(sendSpeed);
  JSON_FOR_PHONE_UNUSED = [...JSON_FOR_PHONE_UNUSED].slice(sendSpeed);
  sendSpeed = SENDS_PER_SECOND;
  if (JSON_UNUSED.length > 0) {
    console.log('wo');
    let sendTime = await delay(DELAY);
    clearTimeout(sendTime);
    sendMessages(
      JSON_UNUSED,
      JSON_FOR_PHONE_UNUSED,
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
    fs.unlink('./publicForMobiniti/file.csv', (err, data) => {
      console.log('file unlink success');
    });
    // fs.unlink('./publicForMobiniti/phone.csv', (err, data) => {
    //   console.log('file unlink success');
    // });
    let fileFromDb = await FileName.findOne({ name: 'file.csv' });

    fileFromDb.isSending = false;
    fileFromDb.isPause = false;
    await fileFromDb.save();
    console.log('saved');
    console.log('end');
  }
};
