import { ApiResponse } from "../utils/api-Response.js";
import asyncHandler from "../utils/Async-handler.js";



const healthCheck = asyncHandler(async(req,res)=>{
    res 
    .status(200)
    .send(new ApiResponse(200,"Server is healthy and running fine"))
})



export {
healthCheck
}

