
const getURL = () => {
  var request = require("request");

  var options = { method: 'POST',
    url: 'https://www.arcgis.com/sharing/rest/oauth2/token',
    qs:
     { client_id: 'lvoymTBADbyoZumC',
       client_secret: 'c98c84a7a3a64c06aaa0996b64cc0856',
       grant_type: 'client_credentials' },
    headers:
     { 'Postman-Token': '60a9c38e-0f4e-4315-ad6f-6164a04b45e5',
       'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    return(body);
  });
}

const queryURL = { getURL }
export default queryURL;
