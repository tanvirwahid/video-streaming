require('dotenv').config();
const path = require('path');
const xml2js = require('xml2js');
const fs = require('fs');
const { log } = require('console');

const getFile = (request, response) => {
    const filePath = path.join(__dirname, '/../../videos/manifest.mpd');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return response.status(500).send('Error reading file');
        }

        // Parse the MPD file
     

            try {
                // BaseURL to be added
                const baseURL = process.env.BASE_URL;

                 const modifiedData = data.replace(/(<AdaptationSet[^>]*>)/g, `$1<BaseURL>${baseURL}</BaseURL>`);

            // Send the modified XML as the response
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
    const filePath = path.join(__dirname, '/../../videos', segment);
    response.sendFile(filePath);
}

module.exports = {
    getFile,
    getSegment
}