import { Router } from "express";
import { ProjectControllers } from "../controllers/ProjectControllers";
import { TaskControllers } from "../controllers/TaskControllers";
import { projectExist } from "../middleware/project";

const router = Router()


/** Project Routes **/

router.post('/' , ProjectControllers.createProject )

router.get('/' , ProjectControllers.getAllProject )

router.get('/:projectId' , ProjectControllers.getOneProject )

router.put('/:projectId' , ProjectControllers.updateProject )

router.delete('/:projectId' , ProjectControllers.deleteProject )


// verificamos que el proyecto exista de forma global
router.param('projectId', projectExist)


/** Task Routes **/

router.post('/:projectId/task'  , TaskControllers.createTask )

router.get('/:projectId/task/:taskId'  , TaskControllers.getOneTask )

router.get('/:projectId/task/'  , TaskControllers.getProjectTask )

router.put('/:projectId/task/:taskId' , TaskControllers.updateTask )

router.delete('/:projectId/task/:taskId' , TaskControllers.deleteTask )


export default router