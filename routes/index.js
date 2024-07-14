const express = require('express');
const router = express.Router();
const videoController = require('../app/controllers/videoController');
const dashMpdController = require('../app/controllers/dashMpdFileController');
const uploadMiddleware  = require('../app/middlewares/mutler');
const uploadController = require('../app/controllers/uploadController');
const authMiddleware = require('../app/middlewares/authMiddleware');
const authController = require('../app/controllers/auth//authController');

router.get('/', (req, res) => {
    res.send('Hello world');
});

router.get('/user', authMiddleware.verifyToken, async(req, res) => {
    return res.status(200).json(req.user);
})

router.post('/login', authMiddleware.guest, authController.login);
router.post('/register', authMiddleware.guest, authController.register);

router.get('/demo-video', videoController.getDemoVideo);
router.get('/video-mpd', dashMpdController.getFile);
router.get('/video/:segment', dashMpdController.getSegment);

router.post('/video/upload', uploadMiddleware.upload.single('video'), uploadController.uploadVideoFile);

module.exports = router;