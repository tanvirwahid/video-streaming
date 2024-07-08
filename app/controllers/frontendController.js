const upload = async (request, response) => {
    return response.render('upload');
}

const play = async (request, response) => {
    return response.render('play');
}

const login = async (request, response) => {
    return response.render('auth/login');
}

const register = async (request, response) => {
    return response.render('auth/register');
}

module.exports = {
    upload,
    play,
    login,
    register
}