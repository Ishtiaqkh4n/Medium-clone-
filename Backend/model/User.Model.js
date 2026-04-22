import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config()

const UserSchema = new Schema({
    avatar: {
        url: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        },
        public_id: {
            type: String
        }
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[5,"USername must be at least 5 characters"],
        maxLength:[20,"Username cannot exceed 20 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password must be at least 8 characters"]
    },

    refreshToken: {
        type: [String]
    }
},{timestamps:true})


//hash the password
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

// compare the password 
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// change the refresh token
UserSchema.methods.generateAccessToken = async function () {

    return jwt.sign(
        {
        _id: this._id
        },
        "testing",
        { expiresIn:"1d"}
    )
    
}

UserSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
         _id:this._id   
        },
       "testingtesting",
        {expiresIn:"7d"}
    )
}



const User = mongoose.model("User", UserSchema)


export {
    User
}
