import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, // already hashed
    expiresAt: Date,
    otp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Otp"
}
});

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);