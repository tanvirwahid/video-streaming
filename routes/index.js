const express = require('express');
const router = express.Router();
let videoController = require('../app/controllers/videoController');

router.get('/', (req, res) => {
    res.send('Hello world');
});

router.get('/demo-video', videoController.getDemoVideo);

module.exports = router;