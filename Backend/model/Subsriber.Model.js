const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    followerId: String,
    followingId: String
    
}, { timestamps: true });

const Subscriber= mongoose.model('Subscriber', subscriberSchema);


export {
    Subscriber
}