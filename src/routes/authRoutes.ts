import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/create-account' , 
    
    body('name')
        .notEmpty().withMessage('El Nombre no puede ir Vacio'),

    body('email')
        .isEmail().withMessage('El Email no puede ir Vacio'),

    body('password')
        .isLength({min : 8}).withMessage('El password es muy corto , debe ser mayor a 8  caracteres'),

    body('password_confirmation').custom(( value , { req }) => {

        if( value !== req.body.password) { 
            throw new Error('Las Password no son iguales')
        }

        return true
    }),

    handleInputErrors,
    
AuthController.createAccount )

router.post('/confirm-account' , 

    body('token')
        .notEmpty().withMessage('El Token no puede ir Vacio'),
    
    handleInputErrors,

AuthController.confirmAccount)

router.post('/login' , 

    body('email')
        .notEmpty().withMessage('El Email no puede ir Vacio'),
    
    body('password')
        .notEmpty().withMessage('La Password no puede ir vacio'),
    
    handleInputErrors,

AuthController.login)

router.post('/request-code' , 

    body('email')
        .notEmpty().withMessage('El Email no puede ir Vacio'),
    
    handleInputErrors,

AuthController.requestConfirmationCode)

router.post('/forgot-password' , 

    body('email')
        .notEmpty().withMessage('El Email no puede ir Vacio'),
    
    handleInputErrors,

AuthController.forgotPassword)

router.post('/validate-token' , 

    body('token')
        .notEmpty().withMessage('El Token no puede ir Vacio'),
    
    handleInputErrors,

AuthController.validateToken)

router.post('/update-password/:token' , 

    param('token')
        .isNumeric().withMessage('El Token no es valido'),

    body('password')
        .isLength({min : 8}).withMessage('El password es muy corto , debe ser mayor a 8  caracteres'),

    body('password_confirmation').custom(( value , { req }) => {

        if( value !== req.body.password) { 
            throw new Error('Las Password no son iguales')
        }

        return true
    }),
    
    handleInputErrors,

AuthController.UpdatePasswordWithToken)

router.get('/user' , 

    authenticate,

AuthController.user)

/** Profile  **/

router.put('/profile' , 
    
    authenticate,

    body('email')
        .notEmpty().withMessage('El Email no puede ir Vacio'),

    body('name')
        .notEmpty().withMessage('El Nombre no puede ir Vacio'),

    handleInputErrors,

AuthController.updateProfile)

router.post('/update-password' , 
    authenticate,

    body('current_password')
        .notEmpty().withMessage('El Nombre no puede ir Vacio'),

    body('password')
        .isLength({min : 8}).withMessage('El password es muy corto , debe ser mayor a 8  caracteres'),

    // compprobacion de ambas password sean iguales
    body('password_confirmation').custom(( value , { req }) => {

        if( value !== req.body.password) { 
            throw new Error('Las Password no son iguales')
        }

        return true
    }),

    handleInputErrors,

AuthController.updateCurrentUserPassword)

 
export default router