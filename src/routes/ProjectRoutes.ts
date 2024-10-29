import { Router } from "express";
import { ProjectControllers } from "../controllers/ProjectControllers";

const router = Router()

router.get('/' , ProjectControllers.getAllProject )

router.post('/' , ProjectControllers.createProject )

export default router