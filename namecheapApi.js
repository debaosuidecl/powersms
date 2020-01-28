let request = require('request');
const test = () => {
  request(
    `https://api.namecheap.com/xml.response?ApiUser=freshdatanow&APIKey=456695e07b3648ae8daeb66ea750f3db&UserName=freshdatanow&ClientIp=45.41.134.50&Command=namecheap.domains.check&DomainList=hey.red,delilah.red,rebecca.site,growbig.site,bigdick.red`,
    (err, res, body) => {
      console.log(body);
      // console.log(res);
      console.log(err);
    }
  );
};

test();
