const express = require('express');
const router = express.Router();
const videoController = require('../app/controllers/videoController');
const dashMpdController = require('../app/controllers/dashMpdFileController');
const uploadMiddleware  = require('../app/middlewares/mutler');
const uploadController = require('../app/controllers/uploadController');

router.get('/', (req, res) => {
    res.send('Hello world');
});

router.get('/demo-video', videoController.getDemoVideo);
router.get('/test-mpd', dashMpdController.getFile);
router.get('/video/:segment', dashMpdController.getSegment);

router.post('/video/upload', uploadMiddleware.upload.single('video'), uploadController.uploadVideoFile);

module.exports = router;