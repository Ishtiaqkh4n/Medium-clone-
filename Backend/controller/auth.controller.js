import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/api-Error";
import { ApiResponse } from "../utils/api-Response.js";



const RegisterUser = asyncHandler(async(req , res)=>{
//give me username or email &&  password
const  {username,email,password} = req.body
 
//   check if user exist in the DB
const checkUser = await User.findOne({
    $or:[{username},{email}]
})

if(checkUser){
    throw new ApiError(
        401,
        "User with this email or username already exist"
    )
}

const user = await User.create({
    username,
    email,
    password
})
///We will handle validation through express validator
//  in the route file and we will set validateBeforeSave to false 
// to avoid validation error when we save the user because we will handle 
// validation through express validator in the route file
user.save({validateBeforeSave:false})

const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createUser){
    throw new ApiError(
        500,
        "Something went wrong while registering the user"
    )
}

return res
.status(201)
,json(
    new ApiResponse(
        201,
        "User registered successfully",
        createUser
    )
)
})


const LoginUser = asyncHandler(async(req , res)=>{

    const {email,password} = req.body

    if(!email || !password){
        throw new ApiError(
            404,
            "Please provide email and password"
        )
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(
            400,
            "Please provide a valid email user with this email does not exist"
        )
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(
            400,
            "invalid password provide correct password ",
        )
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
  
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})

    const LoginedUser = await User.findById(user._id).select(
          "-password -refreshToken"
    )

    //make the cookie secure  
    const options = {
        httpOnly:true,
        secure:true
    }
    
    return res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(
            200,
            "User logged in successfully",
            LoginedUser,
        )
    )   
})

const LogoutUser = asyncHandler(async(req , res)=>{
    
    
})

const DeleteUser = asyncHandler(async(req , res)=>{
    
})


const refreshToken = asyncHandler(async(req , res)=>{
    
})



export{

    RegisterUser,
    LoginUser,
    LogoutUser,
    refreshToken,
    DeleteUser

}