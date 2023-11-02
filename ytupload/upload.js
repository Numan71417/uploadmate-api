const axios = require('axios');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express')
const router = express.Router()

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = './token.json';
const CLIENT_SECRETS_PATH = './credentials.json';

const credentials = require(CLIENT_SECRETS_PATH);


var oAuth2Client;

const authorize = async () => {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  oAuth2Client = new OAuth2Client(client_id, client_secret, `http://localhost:8000/oauth2callback`);
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);
  return authUrl
};

router.get('/auth', async(req, res) => {
  const authurl = await authorize();
  res.status(200).json(authurl);
});

router.get('/oauth2callback', async (req, res) => {
  const authorizationCode = req.query.code;

  const { tokens } = await oAuth2Client.getToken(authorizationCode);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

  console.log('Authorization successful. You can close this window.');
  console.log(oAuth2Client)

  res.status(200).json({tokens,msg:'Authorization successful. You can close this window.',oAuth2Client})
});


router.post('/upload', async (req, res) => {
  const videoUrl = req.body.videoUrl;
  const options = {
    title: req.body.title || 'Test Title',
    description: req.body.description || 'Test Description',
    category: req.body.category || '22',
    keywords: req.body.keywords || 'keyword1, keyword2',
    privacyStatus: req.body.privacyStatus || 'public',
  };

  console.log(oAuth2Client)

  if (!oAuth2Client) {
    return res.status(400).send('Authorization required');
  }

  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: oAuth2Client,
    });

    // Rest of the video upload code here
    uploadVideoFromURL(youtube, videoUrl, options, res);
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
    res.status(500).send('An error occurred during video upload.');
  }
});

// Define a function to upload a video from a URL
const uploadVideoFromURL = async (youtube, videoUrl, options, res) => {
  try {
    // Fetch the video from the URL using axios
    const response = await axios.get(videoUrl, { responseType: 'stream' });

    // Create a writeable stream to stream the video directly to YouTube
    const media = {
      body: response.data,
    };

    const tags = options.keywords ? options.keywords.split(',') : [];

    const body = {
      snippet: {
        title: options.title,
        description: options.description,
        tags: tags,
        categoryId: options.category,
      },
      status: {
        privacyStatus: options.privacyStatus,
      },
    };

    const youtubeRes = await youtube.videos.insert({
      auth: oAuth2Client,
      part: Object.keys(body).join(','),
      media: media,
      resource: body,
    });

    if (youtubeRes.data && youtubeRes.data.id) {
      console.log(`Video id '${youtubeRes.data.id}' was successfully uploaded.`);
      res.send(`Video id '${youtubeRes.data.id}' was successfully uploaded.`);
    } else {
      console.error(`The upload failed with an unexpected response: ${youtubeRes}`);
      res.status(500).send('Video upload failed.');
    }
  } catch (err) {
    console.error(`An error occurred: ${err.message}`);
    res.status(500).send('An error occurred during video upload.');
  }
};

module.exports = router



