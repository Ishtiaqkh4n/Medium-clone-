const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    followerId: String,
    followingId: String
    
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);