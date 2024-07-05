require('dotenv').config();
const {log} = require('console');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const getFile = (request, response) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    const key = request.params.location+'/manifest.mpd';

    const params = {
        Bucket: bucketName,
        Key: key
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error fetching file from S3:', err);
            return response.status(500).send('Error fetching file from S3');
        }

        try {
            const fileContent = data.Body.toString('utf-8');
            const baseURL = process.env.BASE_URL;

            const modifiedData = fileContent.replace(/(<AdaptationSet[^>]*>)/g, `$1<BaseURL>${baseURL}</BaseURL>`);

            response.set('Content-Type', 'application/dash+xml');
            response.send(modifiedData);
        } catch (err) {
            console.error('Error processing MPD file:', err);
            response.status(500).send('Error processing MPD file');
        }
    });
};

const getSegment = (request, response) => {
    const segment = request.params.segment;
    const bucketName = process.env.S3_BUCKET_NAME;
    const key = `${request.params.location}/${segment}`; // Adjust the path if necessary

    const params = {
        Bucket: bucketName,
        Key: key
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.error('Error fetching file from S3:', err);
            return response.status(500).send('Error fetching file from S3');
        }

        response.set('Content-Type', data.ContentType);
        response.send(data.Body);
    });
};

module.exports = {
    getFile,
    getSegment
}