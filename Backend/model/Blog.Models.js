import mongoose from 'mongoose';

const BlogSchemea = new mongoose.Schema({
    author: { type: String, required: true },
    thumbnail: String,
    title: String,
    Body: String,
    tags: [String],
}, { timestamps: true });

const Blog = mongoose.model('Blog',BlogSchemea);


export {
    Blog
}