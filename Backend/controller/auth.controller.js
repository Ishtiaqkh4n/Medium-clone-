import asyncHandler from "../utils/Async-handler.js";
import { User } from "../model/User.Model.js";
import { ApiError } from "../utils/api-Error.js";
import { ApiResponse } from "../utils/api-Response.js";
import jwt from "jsonwebtoken"


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
.json(
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

    const LogoutUser  =  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
    if(!LogoutUser){
        throw new ApiError(
            404,
            "something went wrong "
        )
    }
    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(
        new ApiResponse(
            200,
            "user logged out"
        )
    )
    

})

const DeleteUser = asyncHandler(async(req , res)=>{
    
   const deletedUser = await User.findByIdAndDelete(req.user._id)
   const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status(204)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(
        new ApiResponse(
            204,
            "user deleted successfully"
        )
    )

})
const refreshAccessToken = asyncHandler(async(req , res)=>{
    const RT= req.cookies.refreshToken || req.body.refreshToken
    if(!RT){
        throw new ApiError(404,"Unauthorized access")
    }
    try {
        const decode = jwt.verify(RT,REFRESH_TOKEN_SECRET)
        if(!decode){
           throw new ApiError(404,"invalid token")
        }
        const user = await User.findById(decode._id)
        if(!user){
           throw new ApiError(404,"Invalid token user with this token not found")
        }

        if(RT!==user.refreshToken){
           throw new ApiError("Refresh Token is expired")
        }
        const options = {
          httpOnly:true,
          secure:true
        }

        const NewaccessToken = await user.generateAccessToken()
        const NewrefreshToken = await user.generateRefreshToken()

        user.refreshToken = NewrefreshToken;
        await user.save()

        return res
        .status(200)
        .cookie("refreshToken",NewrefreshToken,options)
        .cookie("accessToken",NewaccessToken,options)
        .json(
            new ApiResponse(
                200,
                "Token refreshed successfully",
            )  
    )       
    } catch (error) {
        new ApiError(404,"Unauthorized access")
    }

})




export{

    RegisterUser,
    LoginUser,
    LogoutUser,
    refreshAccessToken,
    DeleteUser,
    

}