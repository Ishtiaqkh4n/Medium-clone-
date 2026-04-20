const mongoose = require('mongoose');

const BlogSchemea = new mongoose.Schema({
    author: { type: String, required: true },
    thumbnail: String,
    title: String,
    Body: String,
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Blog',BlogSchemea);