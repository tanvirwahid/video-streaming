require('dotenv').config(); // Load environment variables from .env file
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const s3Service = require('./s3Service');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const upload = async (request) => {
    const chunksDir = path.join(__dirname, '../../videos');

    if (fs.existsSync(chunksDir)) {
        fs.rmSync(chunksDir, { recursive: true, force: true });
    }

    if (!fs.existsSync(chunksDir)) {
        fs.mkdirSync(chunksDir);
    }

    const inputFilePath = request.file.path;

    ffmpeg(inputFilePath)
        .output(path.join(chunksDir, 'manifest.mpd'))
        .format('dash')
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
            '-use_template', '1',
            '-use_timeline', '1',
            '-seg_duration', '10',
            '-init_seg_name', 'init-$RepresentationID$.m4s',
            '-media_seg_name', 'chunk-$RepresentationID$-$Number$.m4s'
        ])
        .on('end', async () => {
            fs.unlinkSync(inputFilePath);
            console.log('DASH packaging completed successfully');

            const bucketName = process.env.S3_BUCKET_NAME;
            const folderName = 'videos';

            //@todo remove this after implementing video list service
            await s3Service.deleteS3Folder(bucketName, folderName);

            await s3Service.createS3Folder(bucketName, folderName);

            // Upload all files in the chunks directory to S3
            const files = fs.readdirSync(chunksDir);
            for (const file of files) {
                const filePath = path.join(chunksDir, file);
                const fileContent = fs.readFileSync(filePath);
                const contentType = file.endsWith('.mpd') ? 'application/dash+xml' : 'video/mp4';
                await s3Service.uploadToS3(bucketName, `${folderName}/${file}`, fileContent, contentType);
                console.log(`Uploaded ${file} to S3`);
            }
            
            fs.rmSync(chunksDir, { recursive: true, force: true });

            console.log('All files uploaded to S3 successfully');
        })
        .on('error', (err) => {
            console.error('Error during DASH packaging:', err);
        })
        .run();
};

module.exports = {
    upload
};