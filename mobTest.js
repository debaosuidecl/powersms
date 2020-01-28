var request = require('request');
let token = `aGVsbDIxNDY6WmdUVERaUXU=`;

function callback(error, response, body) {
  console.log(body, 'body');
  console.log(JSON.parse(body));
  console.log(response.statusCode, 'body');
  console.log(error, 'error');
}

// request(
//   {
//     uri: `https://rest-api.d7networks.com/secure/sendbatch`,
//     // json: true,
//     body: JSON.stringify({
//       to: 17144554363,

//       from: 121232,
//       content: 'Hello it is a test from clement  ($) !!!!!!!!! ',
//       dlr: 'yes',
//       'dlr-url': 'http://159.89.55.0:8080/api/delivery',
//       'dlr-level': 3,
//       'dlr-method': 'GET'
//     }),
//     headers: {
//       Authorization: `Basic ${token}`,
//       'Content-Type': 'application/json'
//     },
//     method: 'POST'
//   },

//   callback
// );

request(
  {
    uri: `https://rest-api.d7networks.com/secure/sendbatch`,

    body: JSON.stringify({
      messages: [
        {
          // to: jsonArray.map(group => group.phone).slice(0, sendSpeed),
          to: ['16178778716'],
          content:
            "How farest thou? You're #1480 chose 2 help Amazon pave a safe year! $100 is yours NOW 4 feedback on your purchase http://us-voices.com?FM-JG#E",
          from: 2132334
        }
      ]
    }),
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  },
  callback
);
