import { Router } from "express";
import { AuthControllers } from "../controllers/AuthControllers";
import { handleInputErrors } from "../middleware/validation";
import { body } from "express-validator";
import { authenticate } from "../middleware/auth";

const router = Router()

//router.param( 'userId' , userExist )

router.post('/' , AuthControllers.createUser )

router.post('/confirm-account' , AuthControllers.confirmAccount )

router.post('/login' , AuthControllers.login )

router.post('/forgot-password' , AuthControllers.forgotPassword )

router.post('/validate-token' ,
    
    body('token')
        .notEmpty().withMessage('El Token no puede ir Vacio'),
    
    handleInputErrors,

AuthControllers.validateToken )

router.post('/update-password/:token' , AuthControllers.updatePasswordWithToken )

router.get('/' , authenticate , AuthControllers.user )

// ------------ profile --------------------

router.post('/auth/profile' , authenticate , AuthControllers.updateProfile )


export default router