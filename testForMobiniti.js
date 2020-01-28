var request = require('request');
let uuid = require('uuid');
let token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJmN2FiY2VmZTJmMDU4M2E4M2Y5MmM1NDkyYWNlMGQ5Mjk1ODNiZjhlYTVjOGI1MTQzZDQwMzYxNzJhMTA1Y2Y0ZTI4OTY0ZTk4Y2NhYTZiIn0.eyJhdWQiOiI2NCIsImp0aSI6ImJmN2FiY2VmZTJmMDU4M2E4M2Y5MmM1NDkyYWNlMGQ5Mjk1ODNiZjhlYTVjOGI1MTQzZDQwMzYxNzJhMTA1Y2Y0ZTI4OTY0ZTk4Y2NhYTZiIiwiaWF0IjoxNTc5MDI2NDc0LCJuYmYiOjE1NzkwMjY0NzQsImV4cCI6MTg5NDY0NTY3NCwic3ViIjoiODg4NCIsInNjb3BlcyI6WyJjYW1wYWlnbnMuY3JlYXRlIiwiY2FtcGFpZ25zLmRlbGV0ZSIsImNhbXBhaWducy51cGRhdGUiLCJjYW1wYWlnbnMudmlldyIsImNhbXBhaWducy50ZW1wbGF0ZXMuY3JlYXRlIiwiY2FtcGFpZ25zLnRlbXBsYXRlcy5kZWxldGUiLCJjYW1wYWlnbnMudGVtcGxhdGVzLnVwZGF0ZSIsImNhbXBhaWducy50ZW1wbGF0ZXMudmlldyIsImNvbnRhY3RzLmNyZWF0ZSIsImNvbnRhY3RzLmRlbGV0ZSIsImNvbnRhY3RzLnVwZGF0ZSIsImNvbnRhY3RzLnZpZXciLCJjb250YWN0cy5pbXBvcnRzLnZpZXciLCJjb3Vwb25zLmNyZWF0ZSIsImNvdXBvbnMuZGVsZXRlIiwiY291cG9ucy51cGRhdGUiLCJjb3Vwb25zLnZpZXciLCJncm91cHMuY3JlYXRlIiwiZ3JvdXBzLmRlbGV0ZSIsImdyb3Vwcy51cGRhdGUiLCJncm91cHMudmlldyIsIm1lc3NhZ2VzLmNyZWF0ZSIsIm1lc3NhZ2VzLnVucmVhZC52aWV3IiwibWVzc2FnZXMudXBkYXRlIiwibWVzc2FnZXMudmlldyIsIm9wdGlucy52aWV3IiwidXNlci5jdXN0b21fZmllbGRzLnZpZXciLCJwaG9uZS1udW1iZXJzLmxvb2t1cCIsInRyYWNraW5nLXBpeGVsLmNyZWF0ZSIsInRyYWNraW5nLXBpeGVsLmRlbGV0ZSIsInRyYWNraW5nLXBpeGVsLnVwZGF0ZSIsInRyYWNraW5nLXBpeGVsLnZpZXciLCJjYXJyaWVycy52aWV3Il19.WxoGtEy4W1asisTbFNdrH2ZS-DJAQm7SetQgBq1ymzk5DYNF8Csx-ktVr55sOHLGheQJSu8yILGlN-poS2jvrN3-g6tta1TmTeadUvOVu_4YdemPvCpT_YNPa4bzNCvAwEIIrm91CLauuHny6TVtrclIg5Z2DQlU2E8_crdEo77vuHYBsfchfbx2T-9uH_d4lex5cSMN_i_aiRQtQm15gTMBx8IV461xm0_Q07ow8wDz-2mzV6Lpu6vw-97MeiibSF2C90pqEMu5sjAi4ikhEcYlyUktQnb5iBvarQThOAUUFKobBTl9eXGWGvbnymcr6-ZwCcGNOTSwe1O36NLd-29JHomT3eiktly6KXDydSALiOj6LQtQAPIuQjNxvU9CR3FGpwIV14J32qzIPmAhfaU1I5-PAUMHzkfTTQC5SYXNEmkEQ2uOaCo7tByNIiLL6QOyh657M09Evd859hgv4TJP-fItEl-mCQeHiEpj9myn0h7QBlAQnrujb15nM2XM4humG-mX7SVQ84F-XYAUWZvEn_vl8S4op72ZS9NK3PHRrNHrokR8w8KtlsRyY4KhEypUXO8PmAb0-i_Gw8woExoUpEFRiuFf40CEGfHOrj7dRuh-Dv1b5qqccEHW8HqGhPnqnlNzXDdsDAAiiVrefw0UNZ_2iyWcva7PF7EkSdY`;

// // {"phone_number":"+15709999999","message":"test message","from":"+15702609758"}
function callback(error, response, body) {
  console.log(body, 'body');
  // console.log(JSON.parse(body));
  // console.log(response.statusCode, 'body');
  console.log(error, 'error');
}
// request(
//   {
//     uri: `https://api.mobiniti.com/v1/message`,
//     // json: true,
//     json:
//       //  JSON.stringify(
//       {
//         phone_number: '+17144554363',
//         message: 'test message',
//         from: '+13078864769'
//       },

//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     method: 'POST'
//   },

//   callback
// );
// let phone_numbersList = [
//   '+19785947255',
//   '+19785947232',
//   '+19785947235',
//   '+19785394367',
//   '+19785947286'
// ];
// let dids = [
//   '13078864802',
//   '13078864823',
//   '13078864899',
//   '13078864800',
//   '130788648011'
// ];

// const objectReturn = (phone_numbersList, dids, speed) => {
//   let obj = {};
//   for (let i = 0; i < speed; i++) {
//     obj = {
//       ...obj,
//       [phone_numbersList[i]]: dids[i]
//     };
//   }
//   return obj;
// };

// console.log(objectReturn(phone_numbersList, dids, 3));

// return;
request.post(
  `https://api.mobiniti.com/v1/message/batch`,
  {
    // json: true,
    json: {
      message: "Reminder for your doctor's appnt. January 16th at 12:00PM ",
      phone_numbers: ['+19785947255']
      // from: { '+19785947255': '13078864802' }
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  },

  callback
);

// request.get(
//   `https://api.mobiniti.com/v1/messages?include-receipt`,
//   {
//     // // json: true,
//     // json:
//     //   //  JSON.stringify(
//     //   {
//     //     phone_number: '+17144554363',
//     //     message: 'test message',
//     //     from: '+13078864769'
//     //   },

//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//     // method: 'POST'
//   },

//   callback
// );

// JSON.stringify({
//   phone_number: '+17144554363',
//   message: 'test message',
//   from: '+13078864769'
// });
