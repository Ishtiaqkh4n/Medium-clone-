import { Router } from "express";

import {
    RegisterUser,
    LoginUser,
    refreshToken,
    LogoutUser,
    DeleteUser
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

router.route("/logout").post(LogoutUser)

router.route("/delete").delete(DeleteUser)




export default router;