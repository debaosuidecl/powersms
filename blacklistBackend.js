const br = require('./blackListAsyncCreator');

const fs = require('fs');
const express = require('express');
const app = express();
let socket = require('socket.io');
let fsExtra = require('fs-extra');
let PORT = 8024;
const multer = require('multer');
const connectDB = require('./config/db');
const path = require('path');

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
