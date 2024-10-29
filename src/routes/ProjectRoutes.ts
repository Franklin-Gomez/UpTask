import { Router } from "express";
import { ProjectControllers } from "../controllers/ProjectControllers";

const router = Router()

router.get('/' , ProjectControllers.getAllProject )

router.post('/' , ProjectControllers.createProject )

router.patch('/' , ProjectControllers.updateProject )

router.delete('/' , ProjectControllers.deleteProject )

export default router