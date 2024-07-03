const upload = async (request, response) => {
    return response.render('upload');
}

const play = async (request, response) => {
    return response.render('play');
}

module.exports = {
    upload,
    play
}