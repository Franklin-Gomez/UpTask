import { Router } from "express";
import { AuthControllers } from "../controllers/AuthControllers";
import { userExist } from "../middleware/auth";

const router = Router()

//router.param( 'userId' , userExist )

router.post('/' , AuthControllers.createUser )

router.post('/confirm-account' , AuthControllers.confirmAccount )

router.post('/login' , AuthControllers.login )

router.post('/forgot-password' , AuthControllers.forgotPassword )

router.post('/validate-token' , AuthControllers.validateToken )

router.post('/update-password/:token' , AuthControllers.updatePasswordWithToken )


export default router