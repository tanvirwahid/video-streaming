const fs = require('fs');
const path = require('path');
const {request, response} = require("express");
const videoService = require("../services/videoService");

const getDemoVideo = (request , response) => {
    let videoPath = path.join(__dirname + '/../../public/videos/class4.mp4');
    console.log(__dirname);
    getFile(request, response, videoPath);
}

///@todo remove it from export after file fetching mechanism is done
const getFile = (request, response, videoPath) => {
    let stat = fs.statSync(videoPath);
    let fileSize = stat.size;
    let range = request.headers.range;

    let {start, end} = videoService.getStartAndEnd(range, fileSize);

    if(start >= fileSize )
    {
        response.status(416).send("Request not satisfiable");
    }

    let chunkSize = (end - start) + 1;
    let file = fs.createReadStream(videoPath, {start, end});

    let head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
    };

    console.log(chunkSize, fileSize);

    response.writeHead(206, head);
    file.pipe(response);

}

module.exports = {
    getDemoVideo,
    getFile
}