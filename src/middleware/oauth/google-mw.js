const superagent = require('superagent');

/**
 * This function receives data from the user input in index.js, and once the server is confirmed to use Google's API services, this function sends the authorization code back to Google in order to retrieve the user info.
 * @param {object} request  This is the request passed from routes/oauth/google.js
 */
let getUserData = async request => {
  // Retreive the authorization code for the selected google account
  let authCode = request.query.code;

  // Make asynchronous call to Google API sending auth code from selected google account
  let googleRes = await superagent
    .post(process.env.GOOGLE_TOKEN_SERVICE)
    .type('form')
    .send({
      code: authCode,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.HOME_URL}/google-oauth`,
      grant_type: 'authorization_code',
    });

  // Store the access token from the response from Google's API
  let access_token = googleRes.body.access_token;

  // Send credentials to Google API and authorize using Bearer token
  googleRes = await superagent
    .get(process.env.GOOGLE_API)
    .set('Authorization', `Bearer ${access_token}`);

  // Retreive user's Google account data from Google API response
  let userData = googleRes.body;
  return userData;
};

module.exports = getUserData;
