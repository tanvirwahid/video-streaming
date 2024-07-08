const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploadToS3 = async (bucket, key, body, contentType) => {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
    };

    return s3.upload(params).promise();
};

const deleteS3Folder = async (bucket, folder) => {
    const listParams = {
        Bucket: bucket,
        Prefix: folder,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await deleteS3Folder(bucket, folder);
};

const createS3Folder = async (bucket, folder) => {
    const params = {
        Bucket: bucket,
        Key: `${folder}/`,
        Body: '',
    };

    return s3.putObject(params).promise();
};

module.exports = {
    uploadToS3,
    deleteS3Folder,
    createS3Folder
}