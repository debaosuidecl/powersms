module.exports = async function(phoneList) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://api.theblacklist.click/standard/api/v3/bulkLookup/key/${apikey}/response/json`,

        json: {
          phones: phoneList
        },

        method: 'POST'
      },
      function(error, response, body) {
        if (error) reject(error);
        else resolve(body);

        // console.log(response.statusCode, 'body');
        // console.log(error, 'error');
      }
    );
  });
};
