const express = require('express');
const app = express();

app.get('/api/delivery/:phoneNumber', (req, res) => {
  console.log(req.query);
  console.log(req.params);

  res.json(req.query);

  // console.log(res);
  // res.send(res);
  // res.send(`${res}`);
});

app.listen(8080, () => {
  console.log('listening on port 8080');
});
