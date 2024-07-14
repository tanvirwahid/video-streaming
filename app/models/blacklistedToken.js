const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);