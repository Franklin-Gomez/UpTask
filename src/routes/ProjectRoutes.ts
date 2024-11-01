import { Router } from "express";
import { ProjectControllers } from "../controllers/ProjectControllers";

const router = Router()

router.post('/' , ProjectControllers.createProject )

router.get('/' , ProjectControllers.getAllProject )

router.get('/:id' , ProjectControllers.getOneProject )

router.put('/:id' , ProjectControllers.updateProject )

router.delete('/:id' , ProjectControllers.deleteProject )

export default router