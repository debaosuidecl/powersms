let express = require('express');
let app = express();
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.get('/api/downloadnew', function(req, res) {
  // let q = req.query.q || 1;
  let randomFileName = `./public/file.csv`;
  try {
    return res.download(randomFileName); // Set disposition and send it.
  } catch (e) {
    console.log('error');
  }
});

app.listen(8000, () => {
  console.log('listening on port 8000');
});
