const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const keys = require('../../config/keys');
const BlacklistedToken = require('../../models/blacklistedToken');

const register = async (req, res) => {
    let { name, email, password } = req.body; 

    try {
        let user = await User.findOne({'email' : email});
        console.log(user);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, keys.jwt_secret, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await User.findOne({ 'email' : email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, keys.jwt_secret, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const logout = async (req, res) => {

    const token = req.header('Authorization');

    const blacklistedToken = new BlacklistedToken({
        token,
        expiresAt
    });

    await blacklistedToken.save();
    res.json({ message: 'Logged out successfully' });
}

module.exports = {
    register,
    login,
    logout
};