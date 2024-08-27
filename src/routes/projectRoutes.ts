import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body , param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/' ,
    
    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio')

    ,
    body('clientName')
        .notEmpty().withMessage('El Nombre del cliente es Obligatorio')
    ,
    body('description')
        .notEmpty().withMessage('la descripcion del Proyecto es Obligatorio')
    ,
    handleInputErrors
    
,ProjectController.createProject )


router.get('/' , ProjectController.getAllProjects )  

router.get('/:id' ,
    
    param('id')
        .isMongoId().withMessage('id no valido')
    ,

    handleInputErrors

, ProjectController.getOneProjects ) 

router.put('/:id' ,
    
    param('id')
        .isMongoId().withMessage('id no valido')
    ,

    body('projectName')
        .notEmpty().withMessage('El Nombre del Proyecto es Obligatorio')
    ,

    body('clientName')
        .notEmpty().withMessage('El Nombre del cliente es Obligatorio')
    ,
    
    body('description')
        .notEmpty().withMessage('la descripcion del Proyecto es Obligatorio')
    ,

    handleInputErrors

, ProjectController.updateProject ) 



export default router
