import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body , param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskControllers } from "../controllers/TaskController";
import { ProjectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use( authenticate )

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


router.get('/' 
    
,ProjectController.getAllProjects )  

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

router.delete('/:id', 

    param('id')
    .isMongoId().withMessage('id no valido')

, ProjectController.deleteProject )

/** Routes for tasks **/

// valida el proyecto en cada url que encuentre projectId
router.param('projectId' , ProjectExists)

// valida el taskid  de cada url  que dicha tarea exista
router.param('taskId' , taskExists)
router.param('taskId' , taskBelongsToProject)

router.post('/:projectId/tasks',

    hasAuthorization,

    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio')
    ,

    body('description')
        .notEmpty().withMessage('la descripcion es Obligatorio')
    ,

    handleInputErrors,

TaskControllers.createTasks) 

router.get('/:projectId/tasks', TaskControllers.geProjectTasks)

router.get('/:projectId/tasks/:taskId',
 
    param('taskId')
        .isMongoId().withMessage('id no valido')
    ,

    handleInputErrors,
    
TaskControllers.getTaskById)

router.put('/:projectId/tasks/:taskId',

    hasAuthorization,
 
    param('taskId')
        .isMongoId().withMessage('id no valido')
    ,

    body('name')
        .notEmpty().withMessage('El Nombre de la tarea es Obligatorio')
    ,

    body('description')
        .notEmpty().withMessage('la descripcion es Obligatorio')
    ,

    handleInputErrors,
    
TaskControllers.updateTask)

router.delete('/:projectId/tasks/:taskId',

    hasAuthorization,
 
    param('taskId')
        .isMongoId().withMessage('id no valido')
    ,

    handleInputErrors,
    
TaskControllers.deleteTask)

router.post('/:projectId/tasks/:taskId/status',
 
    param('taskId')
        .isMongoId().withMessage('id no valido')
    ,

    body('status')
        .notEmpty().withMessage('el estado es obligatorio')
    ,

    handleInputErrors,
    
TaskControllers.updateStatus)

/** Routes for Teams **/
router.post('/:projectId/team/find',

    body('email')
        .isEmail().toLowerCase().withMessage('Email no valido')
    ,

    handleInputErrors,

TeamMemberController.findMemberByEmail)

router.get('/:projectId/team', TeamMemberController.getProjectsTeam)

router.post('/:projectId/team',

    body('id')
        .isMongoId().withMessage('Id no valido')
    ,

    handleInputErrors,

TeamMemberController.addMemberById)

router.delete('/:projectId/team/:userId',

    param('userId')
        .isMongoId().withMessage('Id no valido')
    ,

    handleInputErrors,

TeamMemberController.removeMemberById)

/** Routes for Notes **/
router.post('/:projectId/tasks/:tasks/notes' , 
    
    body('content')
        .notEmpty().withMessage('La nota no puede ir vacio')
    ,

    handleInputErrors,

NoteController.createNote)

export default router
