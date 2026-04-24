import asyncHandler from "../utils/Async-handler.js";
import { User } from "../model/User.Model.js";
import { ApiError } from "../utils/api-Error.js";
import { ApiResponse } from "../utils/api-Response.js";
import jwt from "jsonwebtoken"
import generateOTP from "../configs/OtpGenerator.js";
import { otpMailSender } from "../configs/OtpMailSender.js";
import Otp from "../model/OTP.model.js";
import { PendingUser } from "../model/PendingUser.Models.js";


const RegisterTempUser = asyncHandler(async (req, res) => {
    const { username, email, password, changeOtp } = req.body;

    // check if already registered user exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(401, "User already exists");
    }

    // check if pending user exists
    let pendingUser = await PendingUser.findOne({ email });

    // ==============================
    // 🔁 CHANGE OTP FLOW
    // ==============================
    if (changeOtp && pendingUser) {

        // delete old otp
        await Otp.findByIdAndDelete(pendingUser.otp);

        // generate new otp
        const newOtpValue = generateOTP();

        const newOtp = await Otp.create({
            otp: newOtpValue,
            email
        });

        // update otp reference
        pendingUser.otp = newOtp._id;
        await pendingUser.save();

        // resend email
        const isSent = await otpMailSender(newOtpValue, email);
        if (!isSent) throw new ApiError(500, "OTP resend failed");

        return res.status(200).json(
            new ApiResponse(200, "New OTP sent successfully")
        );
    }

    // ==============================
    // 🆕 NEW REGISTRATION FLOW
    // ==============================

    const otpValue = generateOTP();

    const isOtpSent = await otpMailSender(otpValue, email);
    if (!isOtpSent) {
        throw new ApiError(500, "Unable to send OTP");
    }

    const otpDoc = await Otp.create({
        otp: otpValue,
        email
    });

    // delete old pending user if exists (optional cleanup)
    if (pendingUser) {
        await Otp.findByIdAndDelete(pendingUser.otp);
        await PendingUser.findByIdAndDelete(pendingUser._id);
    }

    pendingUser = await PendingUser.create({
        username,
        email,
        password,
        otp: otpDoc._id
    });

    return res.status(200).json(
        new ApiResponse(200, "OTP sent successfully, verify it")
    );
});

const RegisterUser = asyncHandler(async (req, res) => {

    if (req.body.length === 0) throw new ApiError(401, "Empty responce")
    const { otp, email } = req.body

    const tempUser = await PendingUser.findOne({ email }).populate("otpId")

    if (!tempUser) {

        throw new ApiError(404, "user not found")
    }

    const isValid = await tempUser.otpId.compareOtp(otp);

    if (!isValid) {
        throw new ApiError(401, "Incorrect Otp")
    }

    const user = await User.create(
        {
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password
        },
        { validateBeforeSave: false }
    );
    if (user) {
        await Otp.findByIdAndDelete(pendingUser.otp._id);
        await PendingUser.findByIdAndDelete(pendingUser._id);
    }

    return res.status(201).json(new ApiResponse(201, "User created successfully"));
});


const LoginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(
            404,
            "Please provide email and password"
        )
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(
            400,
            "Please provide a valid email user with this email does not exist"
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(
            400,
            "invalid password provide correct password ",
        )
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const LoginedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //make the cookie secure  
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                "User logged in successfully",
                LoginedUser,
            )
        )
})


const LogoutUser = asyncHandler(async (req, res) => {

    const LogoutUser = await User.findByIdAndUpdate(
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
    if (!LogoutUser) {
        throw new ApiError(
            404,
            "something went wrong "
        )
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(
                200,
                "user logged out"
            )
        )


})

const DeleteUser = asyncHandler(async (req, res) => {

    const deletedUser = await User.findByIdAndDelete(req.user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(204)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(
                204,
                "user deleted successfully"
            )
        )

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const RT = req.cookies.refreshToken || req.body.refreshToken
    if (!RT) {
        throw new ApiError(404, "Unauthorized access")
    }
    const decode = jwt.verify(RT, process.env.REFRESH_TOKEN_SECRET)
    if (!decode) {
        throw new ApiError(401, "invalid token")
    }
    const user = await User.findById(decode._id)
    if (!user) {
        throw new ApiError(401, "Invalid token user with this token not found")
    }
    if (String(RT) !== String(user.refreshToken)) {
        throw new ApiError("Refresh Token is expired")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const NewaccessToken = await user.generateAccessToken()
    const NewrefreshToken = await user.generateRefreshToken()

    user.refreshToken = NewrefreshToken;
    await user.save()

    return res
        .status(200)
        .cookie("refreshToken", NewrefreshToken, options)
        .cookie("accessToken", NewaccessToken, options)
        .json(
            new ApiResponse(
                200,
                "Token refreshed successfully",
            )
        )
})


export {
    RegisterTempUser,
    RegisterUser,
    LoginUser,
    LogoutUser,
    refreshAccessToken,
    DeleteUser,
}