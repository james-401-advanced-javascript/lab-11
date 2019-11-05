const superagent = require('superagent');

/**
 * This function receives data from the user input in index.js, and once the server is confirmed to use Github's API services, this function sends the authorization code back to Github in order to retrieve the user info.
 * @param {object} request  This is the request passed from routes/oauth/github.js
 */
let getUserData = async request => {
  // Retreive the authorization code for the selected Github account
  let authCode = request.query.code;

  // Make asynchronous call to Github API sending auth code from selected Github account
  let githubRes = await superagent
    .post(process.env.GITHUB_TOKEN_SERVICE)
    .type('form')
    .send({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: authCode,
      redirect_uri: `${process.env.HOME_URL}/github-oauth`,
      state: process.env.GITHUB_STATE,
    });

  // Store the access token from the response from Google's API
  let access_token = githubRes.body.access_token;

  // Send credentials to Github API and authorize using Bearer token
  githubRes = await superagent
    .get(process.env.GITHUB_API)
    .set('Authorization', `Bearer ${access_token}`);

  // Retreive user's Github account data from Github API response
  let userData = githubRes.body;
  return userData;
};

module.exports = getUserData;
