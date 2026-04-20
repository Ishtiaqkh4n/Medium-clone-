import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Comment = mongoose.model('Comment', CommentSchema)

export {
    Comment
}