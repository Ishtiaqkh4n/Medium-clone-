import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-Error.js";
import AsyncHandler from "../utils/Async-handler.js";

const requireAuth = AsyncHandler(async (req, res, next) => {

    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        throw new ApiError(401, "Access token missing", "Unauthorized");
    }

    let decoded;

    try {
        decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded?._id; 
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token", "Unauthorized");
    }


    next();
});

export default requireAuth;