require('dotenv').config();

module.exports = {
    mongo_uri: process.env.MONGO_URI,
    jwt_secret: process.env.JWT_SECRET
};