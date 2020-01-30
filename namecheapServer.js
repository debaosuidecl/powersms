// produce a random list of all possible names and minimum prices
// produce an api that fetches through the possible names
// use the fetch api to get this list and sort through with
// use an api to buy these domains
//obviously will need an xml to json reader
var convert = require('xml-js');
let URLDATA = require('./models/URLDATA');
const fs = require('fs');
const express = require('express');
let request = require('request');
const app = express();
let socket = require('socket.io');
let fsExtra = require('fs-extra');
let PORT = 8023;
const connectDB = require('./config/db');
const path = require('path');
const User = require('./models/UserAuth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
var cors = require('cors');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Request-Headers', 'GET, PUT, POST, DELETE');

  // res.setHeader("'Content-Type', 'application/json'");
  next();
});

app.use('/api/auth', require('./routes/api/auth'));

// @route    POST api/users
// @desc     Register User
// @access   public
app.post(
  '/api/register',
  [
    check('fullName', 'Your full name is required')
      .not()
      .isEmpty(),

    check('email', 'Use a valid Email').isEmail(),
    check(
      'password',
      'Please Enter a password with 6 or more characters'
    ).isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { fullName, email, password } = req.body;

    try {
      // we want to see if the user exist

      // get User's gravatar

      // encrypt the password using bcrypt

      // return a jsonwebtoken so that the user can be logged in immediately

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Already Exists' }] }); //bad request
      }
      // const avatar = gravatar.url(email, {
      //   s: '200', // default size
      //   r: 'pg', // rating - cant have any naked people :)
      //   d: 'mm' // gives a default image
      // });
      user = new User({
        fullName,
        email,
        // avatar,
        password
        // phone: phoneNumber
      });
      const salt = await bcrypt.genSalt(10); // create the salt
      user.password = await bcrypt.hash(password, salt); // to encrypt the user password

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '10h' },
        (error, token) => {
          if (error) throw error;

          res.json({ token, fullName: user.fullName });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  }
);

let server = app.listen(PORT, function() {
  console.log(`listening to requests on port ${PORT}`);
  connectDB();
});

let io = socket(server);
fsExtra.ensureFile('file.csv', () => {
  fsExtra.writeFile('file.csv', 'domain,forwardingURL\n', (err, data) => {});
});
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

io.on('connection', (socket, id) => {
  console.log(socket.id);
  socket.on('download', data => {
    fsExtra.readFile('file.csv', 'utf-8', (err, data) => {
      io.sockets.emit('downloadingNow', data);
    });
  });
  socket.on('clear', data => {
    fsExtra.writeFile('file.csv', 'domain,forwardingURL\n', (err, data) => {
      // io.sockets.emit('downloadingNow', data);
      console.log('cleared');
    });
  });
  socket.on('check', async data => {
    // console.log(data);
    let options = [];
    let {
      domainsList,
      prefixList,
      suffixList,
      tldList,
      Quantity,
      minimumPrice,
      maximumPrice
    } = data;
    domainsList.forEach(value => {
      if (value.name.includes('.')) {
        // console.log(value);
        options.push(value.name);
        domainsList = domainsList.filter(d => d.name !== value.name);
      }
    });
    for (let i = 0; i < domainsList.length; i++) {
      for (let j = 0; j < tldList.length; j++) {
        options.push(
          (domainsList[i].name + '.' + tldList[j].name).replace('..', '.')
        );
      }
    }
    if (prefixList.length > 0) {
      for (let i = 0; i < prefixList.length; i++) {
        for (let j = 0; j < domainsList.length; j++) {
          for (let k = 0; k < tldList.length; k++) {
            options.push(
              (
                prefixList[i].name +
                domainsList[j].name +
                '.' +
                tldList[k].name
              ).replace('..', '.')
            );
          }
        }
      }
    }

    if (suffixList.length > 0) {
      for (let i = 0; i < suffixList.length; i++) {
        for (let j = 0; j < domainsList.length; j++) {
          for (let k = 0; k < tldList.length; k++) {
            options.push(
              (
                domainsList[j].name +
                suffixList[i].name +
                '.' +
                tldList[k].name
              ).replace('..', '.')
            );
          }
        }
      }
    }

    if (prefixList.length > 0 && suffixList.length > 0) {
      for (let i = 0; i < suffixList.length; i++) {
        for (let j = 0; j < domainsList.length; j++) {
          for (let k = 0; k < tldList.length; k++) {
            for (let l = 0; l < prefixList.length; l++) {
              options.push(
                (
                  prefixList[l].name +
                  domainsList[j].name +
                  suffixList[i].name +
                  '.' +
                  tldList[k].name
                ).replace('..', '.')
              );
            }
          }
        }
      }
    }

    // options = options.slice(0, Quantity);
    let quantityCount = 0;
    for (let i = 0; i < options.length; i++) {
      console.log(options[i], 111);
      // if (quantityCount === Quantity) {
      //   console.log(quantityCount, 'quantity reached');
      //   io.sockets.emit('fetchEnd', true);
      //   return;
      // }
      request(
        `https://api.namecheap.com/xml.response?ApiUser=freshdatanow&APIKey=456695e07b3648ae8daeb66ea750f3db&UserName=freshdatanow&ClientIp=105.112.98.221&Command=namecheap.users.getPricing&ProductType=DOMAIN&ProductName=${
          options[i].split('.')[1]
        }`,
        async (err, res, body) => {
          // console.log(body);
          await delay(1000);

          request(
            `https://api.namecheap.com/xml.response?ApiUser=freshdatanow&APIKey=456695e07b3648ae8daeb66ea750f3db&UserName=freshdatanow&ClientIp=45.41.134.50&Command=namecheap.domains.check&DomainList=${options[i]}`,
            (err2, res2, body2) => {
              console.log(err);

              var result2 = convert.xml2json(body2, {
                compact: true,
                spaces: 1
              });
              // console.log(result2, '2');
              let checkJson = JSON.parse(result2);
              if (i === options.length - 1) {
                io.sockets.emit('fetchEnd', true);
              }
              try {
                let isAvailable =
                  checkJson.ApiResponse.CommandResponse.DomainCheckResult[
                    '_attributes'
                  ].Available;
                let isPremiumName =
                  checkJson.ApiResponse.CommandResponse.DomainCheckResult[
                    '_attributes'
                  ].IsPremiumName;
                let domain =
                  checkJson.ApiResponse.CommandResponse.DomainCheckResult[
                    '_attributes'
                  ].Domain;

                var result = convert.xml2json(body, {
                  compact: true,
                  spaces: 1
                });
                let newR = JSON.parse(result);
                let priceDetail =
                  newR['ApiResponse']['CommandResponse'][
                    'UserGetPricingResult'
                  ]['ProductType']['ProductCategory'][0]['Product']['Price'][0][
                    '_attributes'
                  ]['Price'];
                console.log(priceDetail);

                if (
                  isPremiumName === 'false' &&
                  isAvailable === 'true' &&
                  minimumPrice < parseFloat(priceDetail) &&
                  maximumPrice > parseFloat(priceDetail)
                ) {
                  quantityCount++;
                  console.log('quantity added');
                  io.sockets.emit('pushDomain', {
                    domain,
                    isAvailable: isAvailable === 'true',
                    isPremiumName,
                    ...newR['ApiResponse']['CommandResponse'][
                      'UserGetPricingResult'
                    ]['ProductType']['ProductCategory'][0]['Product'][
                      'Price'
                    ][0]['_attributes']
                  });
                }
              } catch (error) {
                console.log(error);
              }
            }
          );
        }
      );
      await delay(1000);
    }
  });

  socket.on('purchase', domain => {
    // const { domain } = data;
    let address =
      '125 Cambridgepark Drive Suite 301 MA, Cambridge, 0214 United States';
    let companyName = `Fresh Data Now LLC`;
    request(
      `https://api.namecheap.com/xml.response?ApiUser=freshdatanow&ApiKey=456695e07b3648ae8daeb66ea750f3db&UserName=freshdatanow&Command=namecheap.domains.create&ClientIP=105.112.98.221&DomainName=${domain}&Years=1&AuxBillingFirstName=Jared&AuxBillingLastName=Mancinelli&AuxBillingAddress1=${address}&AuxBillingStateProvince=CA&AuxBillingPostalCode=01002&AuxBillingCountry=US&AuxBillingPhone=+1.9785947255&AuxBillingEmailAddress=hello@freshdatanow.com&AuxBillingOrganizationName=${companyName}&AuxBillingCity=Massachusettes&TechFirstName=Jared&TechLastName=Mancinelli&TechAddress1=${address}&TechStateProvince=Massachusettes&TechPostalCode=01002&TechCountry=US&TechPhone=+1.9785947255&TechEmailAddress=hello@freshdatanow.com&TechOrganizationName=${companyName}&TechCity=Massachusettes&AdminFirstName=Jared&AdminLastName=Mancinelli&AdminAddress1=${address}&AdminStateProvince=CA&AdminPostalCode=01002&AdminCountry=US&AdminPhone=+1.9785947255&AdminEmailAddress=hello@freshdatanow.com&AdminOrganizationName=${companyName}&AdminCity=Massachusettes&RegistrantFirstName=Jared&RegistrantLastName=Mancinelli&RegistrantAddress1=${companyName}&RegistrantStateProvince=CA&RegistrantPostalCode=01002&RegistrantCountry=US&RegistrantPhone=+1.9785947255&RegistrantEmailAddress=hello@freshdatanow.com&RegistrantOrganizationName=${companyName}&RegistrantCity=CA&AddFreeWhoisguard=yes&WGEnabled=no&GenerateAdminOrderRefId=False&`,
      (err, res, body) => {
        console.log(body);

        var result = convert.xml2json(body, {
          compact: true,
          spaces: 1
        });
        console.log(result);
        let newR = JSON.parse(result);
        console.log(newR.ApiResponse['_attributes'].Status === 'ERROR');
        if (newR.ApiResponse['_attributes'].Status === 'ERROR') {
          io.sockets.emit('errorPurchase', {
            msg: `${newR.ApiResponse.Errors.Error['_text']}`,
            domain
          });
        } else {
          io.sockets.emit('purchaseSuccess', domain);
        }
      }
    );
  });
  socket.on('forward', urlData => {
    const { domain, forwardURL } = urlData;
    let SLD = domain.split('.')[0];
    let TLD = domain.split('.')[1];
    request(
      `https://api.namecheap.com/xml.response?apiuser=freshdatanow&apikey=456695e07b3648ae8daeb66ea750f3db&username=freshdatanow&Command=namecheap.domains.dns.setHosts&ClientIp=122.178.155.204&SLD=${SLD}&TLD=${TLD}&HostName1=@&RecordType1=URL&Address1=${forwardURL}`,
      (err, res, body) => {
        console.log(body);
        io.sockets.emit('forwardSuccess', domain);
        fsExtra.ensureFile('flie.csv');
        fsExtra.appendFile('file.csv', `${domain},${forwardURL}\n`);
      }
    );
  });
  socket.on('bulkPurchaseAndForwarding', newList => {
    fsExtra.ensureFile('file.csv', () => {
      fsExtra.writeFile(
        'file.csv',
        'domain,forwardingURL\n',
        (err, data) => {}
      );
    });

    for (let i = 0; i < newList.length; i++) {
      let address =
        '125 Cambridgepark Drive Suite 301 MA, Cambridge, 0214 United States';
      let companyName = `Fresh Data Now LLC`;
      request(
        `https://api.namecheap.com/xml.response?ApiUser=freshdatanow&ApiKey=456695e07b3648ae8daeb66ea750f3db&UserName=freshdatanow&Command=namecheap.domains.create&ClientIP=105.112.98.221&DomainName=${newList[i].domain}&Years=1&AuxBillingFirstName=Jared&AuxBillingLastName=Mancinelli&AuxBillingAddress1=${address}&AuxBillingStateProvince=CA&AuxBillingPostalCode=01002&AuxBillingCountry=US&AuxBillingPhone=+1.9785947255&AuxBillingEmailAddress=hello@freshdatanow.com&AuxBillingOrganizationName=${companyName}&AuxBillingCity=Massachusettes&TechFirstName=Jared&TechLastName=Mancinelli&TechAddress1=${address}&TechStateProvince=Massachusettes&TechPostalCode=01002&TechCountry=US&TechPhone=+1.9785947255&TechEmailAddress=hello@freshdatanow.com&TechOrganizationName=${companyName}&TechCity=Massachusettes&AdminFirstName=Jared&AdminLastName=Mancinelli&AdminAddress1=${address}&AdminStateProvince=CA&AdminPostalCode=01002&AdminCountry=US&AdminPhone=+1.9785947255&AdminEmailAddress=hello@freshdatanow.com&AdminOrganizationName=${companyName}&AdminCity=Massachusettes&RegistrantFirstName=Jared&RegistrantLastName=Mancinelli&RegistrantAddress1=${companyName}&RegistrantStateProvince=CA&RegistrantPostalCode=01002&RegistrantCountry=US&RegistrantPhone=+1.9785947255&RegistrantEmailAddress=hello@freshdatanow.com&RegistrantOrganizationName=${companyName}&RegistrantCity=CA&AddFreeWhoisguard=yes&WGEnabled=no&GenerateAdminOrderRefId=False&`,
        async (err, res, body) => {
          console.log(body);
          await delay(3000);
          var result = convert.xml2json(body, {
            compact: true,
            spaces: 1
          });
          console.log(result);
          let newR = JSON.parse(result);
          console.log(newR.ApiResponse['_attributes'].Status === 'ERROR');
          if (newR.ApiResponse['_attributes'].Status === 'ERROR') {
            io.sockets.emit('errorPurchase', {
              msg: `${newR.ApiResponse.Errors.Error['_text']}`,
              domain: newList[i].domain
            });
            // // COMMENTING THIS OUT
            // io.sockets.emit('purchaseSuccess', newList[i].domain);
            // let SLD = newList[i].domain.split('.')[0];
            // let TLD = newList[i].domain.split('.')[1];
            // request(
            //   `https://api.namecheap.com/xml.response?apiuser=freshdatanow&apikey=456695e07b3648ae8daeb66ea750f3db&username=freshdatanow&Command=namecheap.domains.dns.setHosts&ClientIp=122.178.155.204&SLD=${SLD}&TLD=${TLD}&HostName1=@&RecordType1=URL&Address1=${newList[i].forwardURL}`,
            //   (err, res, body) => {
            //     console.log(body);
            //     io.sockets.emit('forwardSuccess', newList[i].domain);
            //     // io.sockets.emit('forwardSuccess', newList[i].domain);
            //     fsExtra.appendFile(
            //       'file.csv',
            //       `http://${newList[i].domain},${newList[i].forwardURL}\n`
            //     );

            //     if (i === newList.length - 1) {
            //       console.log('is last');
            //       io.sockets.emit('bulkSendSuccess', true);
            //     }
            //   }
            // );

            // // // COMMENTING THIS OUT
          } else {
            io.sockets.emit('purchaseSuccessBulk', newList[i].domain);
            let SLD = newList[i].domain.split('.')[0];
            let TLD = newList[i].domain.split('.')[1];
            request(
              `https://api.namecheap.com/xml.response?apiuser=freshdatanow&apikey=456695e07b3648ae8daeb66ea750f3db&username=freshdatanow&Command=namecheap.domains.dns.setHosts&ClientIp=122.178.155.204&SLD=${SLD}&TLD=${TLD}&HostName1=@&RecordType1=URL&Address1=${
                newList[i].forwardURL
              }?thru=Jan${new Date().getDate()}.${newList[i].domain}`,
              (err, res, body) => {
                console.log(body);
                io.sockets.emit('forwardSuccessBulk', newList[i].domain);
                fsExtra.appendFile(
                  'file.csv',
                  `${newList[i].domain},${
                    newList[i].forwardURL
                  }?thru=Jan${new Date().getDate()}.${newList[i].domain}\n`
                );
                if (i === newList.length - 1) {
                  io.sockets.emit('bulkSendSuccess', true);
                }
                let newurldata = new URLDATA({
                  domain: newList[i].domain,
                  forwardURL: newList[i].forwardURL
                });
                newurldata.save((err, data) => {
                  if (err) console.log(err);
                  console.log('saved');
                });
              }
            );
          }
        }
      );
    }
  });
});
