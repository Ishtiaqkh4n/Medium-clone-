import { Router } from "express";
import { upload } from "../middlewares/Multer.middlewere.js";

import {
    RegisterUser,
    RegisterTempUser,
    LoginUser,
    LogoutUser,
    DeleteUser,
    
} from  "../controller/Auth.controller.js"

import requireAuth from "../middlewares/Auth.middlewere.js";
import VerifyRefreshToken from "../middlewares/VerifyRefreshToken.middlewere.js";





const router = Router()

router.route("/refresh-token").post(VerifyRefreshToken)

router.use(requireAuth)
router.route("/register").post(RegisterTempUser)
router.route("/otpverify").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/logout").post(LogoutUser)
router.route("/delete").delete(DeleteUser)
router.route("/me/update/:id").put( upload.single("coverImage"),)




export default router;  