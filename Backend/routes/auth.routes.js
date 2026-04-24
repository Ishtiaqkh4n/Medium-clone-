import { Router } from "express";

import {
    RegisterUser,
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

router.route("/register").post(userRegisterValidator(),validateRequest,RegisterUser)

router.route("/login").post(userloginValidator(),validateRequest,LoginUser)

router.route("/logout").post(VerifyJwt,LogoutUser)

router.route("/delete").delete(VerifyJwt,DeleteUser)

router.route("/refresh-token").post(refreshAccessToken)



export default router;  