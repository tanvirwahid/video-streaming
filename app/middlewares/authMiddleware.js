const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/blacklistedToken');
const keys = require('../config/keys');

const verifyToken = async (req, res, next) => {
    
    const token = req.header('Authorization');

    if(!token)
    {
        return res.status(401).json({ status: 401, message: 'Not logged in' });
    }

    const blacklistedToken = await BlacklistedToken.findOne({ 'token' : token });

    if (blacklistedToken) {
        return res.status(401).json({status: 401, message: 'Token has been invalidated' });
    }

    try {
   
        const decoded = jwt.verify(token, keys.jwt_secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ status: 401, message: 'Token is not valid' });
    }
};

const guest = async(req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return next();
    }

    try {
       
        const blacklistedToken = await BlacklistedToken.findOne({ 'token' : token });
        
        if (blacklistedToken) {
            return next();
        }

        jwt.verify(token, keys.jwt_secret, (err, decoded) => {
            if (err) {
            
                return next();
            }

            return res.status(403).json({ message: 'Already authenticated' });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    verifyToken,
    guest
}