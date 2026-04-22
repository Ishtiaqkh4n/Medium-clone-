import { Router } from "express";


const router = Router()

import { healthCheck } from "../controller/serverhealthcheck.js";


router.route("/").get(healthCheck)



export default router