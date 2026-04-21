import {User} from "../model/User.Model.js"
import { ApiError } from "../utils/api-Error.js"
import asyncHandler from "../utils/Async-handler.js"
import jwt from "jsonwebtoken"


const VerifyJwt = asyncHandler(async(req ,res ,next)=>{
  
     //grab the token from the cookie
    const token = req.cookie.accessToken
    //throw if not present
    if(!token){
        throw new ApiError(
            401,
            "Unauthorized Access"
        )
    }
    //decoded it verify it with the key
    const decoded_token = jwt.verify(token,process.env.ACCESS_TOKEN_EXPIRY)

    if(!decoded_token){
        throw new ApiError(
            404,
            "Invalide accessToken"
        )
    }
    
    const user = await User.findById(decoded_token?._id)

    if(!user){
        throw new ApiError(
            404,
            "Invalid acesstoken"
        )
    }
    //checking if tHE RT matches the AT
    if(user.refreshToken !==token){
        throw new ApiError(
            404,
            "nice try stealer fuck you"
        )
    }
    //attach the user to the request object 
    req.user = user
    //coninue to the next middleware or route handler
    next()



})



export {
    VerifyJwt
}