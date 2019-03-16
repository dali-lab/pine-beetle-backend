
const getURL = () => {
  var request = require("request");

  var options = { method: 'POST',
    url: 'https://sgsf.maps.arcgis.com/sharing/rest/generateToken',
    qs:
     { username: 'foresthealth2_sgsf',
       password: 'Forestry12',
       referer: 'https://www.arcgis.com%0A' },
    headers:
     { 'Postman-Token': 'f0a859d2-6748-497a-a35c-0d664ce43f24',
       'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });


  // var request = require("request");
  //
  // var options = { method: 'GET',
  //   url: 'https://www.arcgis.com/sharing/rest/oauth2/authorize',
  //   qs:
  //    { client_id: 'lvoymTBADbyoZumC',
  //      response_type: 'token',
  //      redirect_uri: 'https://pine-beetle-prediction.surge.sh/' },
  //   headers:
  //    { 'Postman-Token': '110839e3-4e4c-4cb8-8128-635c917c7af6',
  //      'cache-control': 'no-cache' } };
  //
  // request(options, function (error, response, body) {
  //   if (error) throw new Error(error);
  //
  //   console.log("body: " + body);
  //   return(body);
  // });


  // var request = require("request");
  //
  // var options = { method: 'POST',
  //   url: 'http://sgsf.maps.arcgis.com/sharing/rest/generateToken',              //'https://www.arcgis.com/sharing/rest/oauth2/token',
  //   qs:
  //    { username: 'foresthealth2_sgsf',
  //     password: 'Forestry12',
  //     referer: 'https://www.arcgis.com' },
  //    // { client_id: 'lvoymTBADbyoZumC',
  //    //   client_secret: 'c98c84a7a3a64c06aaa0996b64cc0856',
  //    //   grant_type: 'client_credentials' },
  //   headers:
  //    { 'Postman-Token': '101ccc24-f899-4308-a418-13f7edcfa5eb', //'60a9c38e-0f4e-4315-ad6f-6164a04b45e5',
  //      'cache-control': 'no-cache' } };
  //
  // request(options, function (error, response, body) {
  //   if (error) throw new Error(error);
  //
  //   return(body);
  // });
}

const queryURL = { getURL }
export default queryURL;
