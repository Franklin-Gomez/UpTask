import { Router } from "express";
import { ProjectControllers } from "../controllers/ProjectControllers";
import { TaskControllers } from "../controllers/TaskControllers";
import { projectExist } from "../middleware/project";
import { taskExist } from "../middleware/task";
import { NoteControllers } from "../controllers/NoteControllers";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { authenticate } from "../middleware/auth";

const router = Router()

// verificamos que el proyecto exista de forma global
router.param('projectId', projectExist)

/** Project Routes **/

router.use( authenticate )

router.post('/' ,

    body("projectName")
        .notEmpty().withMessage("El nombre del proyecto es Obligatorio"),
        
    handleInputErrors

,ProjectControllers.createProject )

router.get('/' , 
        
ProjectControllers.getAllProject )

router.get('/:projectId' , 

    param('projectId')
        .notEmpty().withMessage('id no valido'), 
    
    // handleInputErrors,

ProjectControllers.getOneProject )

router.put('/:projectId' , ProjectControllers.updateProject )

router.delete('/:projectId' , ProjectControllers.deleteProject )


// verificamos que la tarea exista  de forma global
router.param('taskId' , taskExist)

/** Task Routes **/

router.post('/:projectId/task'  , TaskControllers.createTask )

router.get('/:projectId/task/:taskId'  , TaskControllers.getOneTask )

router.get('/:projectId/task'  , TaskControllers.getAllTask )

router.put('/:projectId/task/:taskId' , TaskControllers.updateTask )

router.delete('/:projectId/task/:taskId' , TaskControllers.deleteTask )

router.post('/:projectId/task/:taskId/status' , TaskControllers.updateStatusTask )



/**  Note Routes **/

router.post('/:projectId/task/:taskId/notes' , NoteControllers.createNote)

router.delete('/:projectId/task/:taskId/notes/:noteId' , NoteControllers.deleteNote )


export default router