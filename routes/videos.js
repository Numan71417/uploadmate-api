const express = require('express')
const router = express.Router()
const {addVideo} = require('../controllers/videoController')
const {getVideos} = require('../controllers/videoController')

// add video router
router.post('/videos', addVideo)

//list of videos
router.get('/videos', getVideos)


module.exports = router
