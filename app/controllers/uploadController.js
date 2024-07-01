const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const uploadVideoFile = async (request, resposnse) =>
{
    if (!request.file) {
        return resposnse.status(400).json({ error: 'No file uploaded.' });
    }

    const chunksDir = path.join(__dirname, '../../videos');

    if (fs.existsSync(chunksDir)) {
        fs.rmSync(chunksDir, { recursive: true, force: true });
    }

    if (!fs.existsSync(chunksDir)) {
        fs.mkdirSync(chunksDir);
    }

    const inputFilePath = request.file.path;
    console.log(inputFilePath);

    ffmpeg(inputFilePath)
        .output(path.join(chunksDir, 'manifest.mpd'))
        .format('dash')
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
            '-use_template', '1',
            '-use_timeline', '1',
            '-seg_duration', '40',
            '-init_seg_name', 'init-$RepresentationID$.m4s',
            '-media_seg_name', 'chunk-$RepresentationID$-$Number$.m4s'
        ])
        .on('end', () => {
            fs.unlinkSync(inputFilePath);
            resposnse.json({ message: 'Video chunking completed.', chunksDir: chunksDir });        })
        .on('error', (err) => {
            console.error('Error during DASH packaging:', err);
            resposnse.status(500).json({ error: 'Error during DASH packaging.' });
        })
        .run();
}

module.exports = {
    uploadVideoFile
};