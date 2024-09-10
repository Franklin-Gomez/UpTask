import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { body } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'

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

export default router