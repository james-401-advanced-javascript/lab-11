'use strict';

const express = require('express');

const githubMW = require('../../middleware/oauth/github-mw.js');
const router = express.Router();

/**
 * @route GET /github
 * This route authenticates the server to ensure the request is coming from a verified Github developer account. We collect the url and options from environment variables, and redirect to our /ggithub-oauth route, which then executes the code from our github-mw.js module.
 * @param {object}   req   The request object
 * @param {object}   res   The response object
 * @param {Function} next  We don't use it in here, but this is our method for going to the next middleware or error middleware in the request-response chain
 * @security OAuth
 * @returns {object} 200 - An authenticated URL to send back to Github's API to retreive user info
 */
router.get('/github', (req, res, next) => {
  let githubOAuthURL = process.env.GITHUB_AUTH_SERVICE;
  let options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.HOME_URL + '/github-oauth',
    login: 'james-ad',
    scope: 'user repo',
    state: process.env.GITHUB_STATE,
    allow_signup: 'true',
  };

  // Set up the URL to receive query parameters
  githubOAuthURL += '?';

  // Loop through the options object to assemble the URL query parameters
  Object.keys(options).forEach((key, indx) => {
    githubOAuthURL += key + '=' + encodeURIComponent(options[key]);
    githubOAuthURL += '&';
  });

  // Once the request has been fulfilled, send a status 200 response code and the authenticated URL
  res.status(200).json({ url: githubOAuthURL });
});

/**
 * @route GET /github-oauth
 * This route sends a get request to our /github-oauth route, which then executes the code from our github-mw.js module.
 * @param {object}   req   The request object
 * @param {object}   res   The response object
 * @param {Function} next  We don't use it in here, but this is our method for going to the next middleware or error middleware in the request-response chain
 * @security OAuth
 * @returns {object} 200 - All of the data returned from the selected Github account
 */
router.get('/github-oauth', async (req, res, next) => {
  let data = await githubMW(req);

  // Once the request has been fulfilled, send a status 200 response code along with the user's name and email
  res.status(200).json({ githubData: data });
});

module.exports = router;
