import { Router } from "express";
import { AuthControllers } from "../controllers/AuthControllers";
import { userExist } from "../middleware/auth";

const router = Router()

//router.param( 'userId' , userExist )

router.post('/' , AuthControllers.createUser )

router.post('/confirm-account' , AuthControllers.confirmAccount )

router.post('/login' , AuthControllers.login )

export default router