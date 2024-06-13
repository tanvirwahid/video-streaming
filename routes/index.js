const express = require('express');
const router = express.Router();
const videoController = require('../app/controllers/videoController');
const dashMpdController = require('../app/controllers/dashMpdFileController');

router.get('/', (req, res) => {
    res.send('Hello world');
});

router.get('/demo-video', videoController.getDemoVideo);
router.get('/test-mpd', dashMpdController.getFile);
router.get('/video/:segment', dashMpdController.getSegment);

module.exports = router;