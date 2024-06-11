jest.setTimeout(10000);
const fs = require('fs');
const httpMocks = require('node-mocks-http');
const videoController = require('../app/controllers/videoController');

///@todo test getVideo method after video fetching mechanism is done
describe('getFile function', () => {
    it('should return proper response headers and stream file content' , (done) => {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/test-url',
            headers: {
                range: 'bytes=0-' // Assuming the requested range is valid
            }
        });

        console.log("inside");

        let response = httpMocks.createResponse();
        let videoPath = __dirname + '/sample_video.mp4';

        videoController.getFile(request, response, videoPath);

        response.on('end', () => {

            expect(response.statusCode).toBe(206);

            expect(response._getHeaders()).toHaveProperty('content-range');
            expect(response._getHeaders()).toHaveProperty('accept-ranges', 'bytes');
            expect(response._getHeaders()).toHaveProperty('content-length');
            expect(response._getHeaders()).toHaveProperty('content-type', 'video/mp4');

        });
        done();
    });

})