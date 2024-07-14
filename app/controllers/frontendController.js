require('dotenv').config();

const upload = async (request, response) => {
    return response.render('upload');
}

const play = async (request, response) => {
    return response.render('play', {apiKey: process.env.APP_URL});
}

const login = async (request, response) => {
    return response.render('auth/login', {apiKey: process.env.APP_URL});
}

const register = async (request, response) => {
    return response.render('auth/register', {apiKey: process.env.APP_URL});
}

module.exports = {
    upload,
    play,
    login,
    register
}