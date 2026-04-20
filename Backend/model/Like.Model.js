const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema(
{
    postId: ObjectId,
    userId: String,
    type: "like" | "dislike"
}
, { timestamps: true });

const Like = mongoose.model('Like', LikeSchema)


export{
    Like
}