const path = require('path');

const getFile = (request, response) => {
    console.log("called for mpd");
    const filePath = path.join(__dirname, '/../../videos/video.mpd');
    response.sendFile(filePath);
}

const getSegment = (request, response) => {
    const segment = request.params.segment;
    const filePath = path.join(__dirname, '/../../videos', segment);
    response.sendFile(filePath);
}

module.exports = {
    getFile,
    getSegment
}