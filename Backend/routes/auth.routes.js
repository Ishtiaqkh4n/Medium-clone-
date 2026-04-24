import { Router } from "express";
import { upload } from "../middlewares/Multer.middlewere.js";

import {
    RegisterUser,
    RegisterTempUser,
    LoginUser,
    refreshAccessToken,
    LogoutUser,
    DeleteUser,
    
} from  "../controller/auth.controller.js"


import {
userRegisterValidator,
userloginValidator
} from "../validator/validator.js"

import {
    VerifyJwt
} from "../middleware/auth.middleware.js"

import {
    validateRequest
} from "../middleware/validator.middleware.js"



const router = Router()

////validation 
//jwt verification
//remaingggggg will workkkkkk on that byeeee

router.route("/register").post(RegisterTempUser)
router.route("/otpverify").post(RegisterUser)
router.route("/login").post(userloginValidator(),validateRequest,LoginUser)
router.route("/logout").post(VerifyJwt,LogoutUser)
router.route("/delete").delete(VerifyJwt,DeleteUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/me/update/:id").put( upload.single("coverImage"),)




export default router;  