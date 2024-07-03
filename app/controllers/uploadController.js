const uploadService = require('../services/uploadService');


const uploadVideoFile = async (request, resposnse) =>
{
    if (!request.file) {
        return resposnse.status(400).json({ error: 'No file uploaded.' });
    }

    uploadService.upload(request);

    return resposnse.render('upload', {message: 'Uploaded. Now encoding'});
    
}

module.exports = {
    uploadVideoFile
};