import jwt from 'jsonwebtoken'
import {User} from '../model/User.Model.js'
import asyncHandler from '../utils/Async-handler.js'
import { ApiError } from '../utils/api-Error.js'

const VerifyRefreshToken = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.refreshToken;

    if (!token) {
        throw new ApiError(401, "Refresh token missing. Please login again");
    }

    try {
   
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

      
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token","Unauthorized");
        }

       
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

     
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000
        });

       
        next();

    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }
});

export default VerifyRefreshToken;