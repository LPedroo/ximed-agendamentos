import { Router } from "express"
import { examTypeController } from "../controllers/examTypeController.js"

export const examTypeRoutes = Router()

examTypeRoutes.post("/", examTypeController.create)
examTypeRoutes.get("/", examTypeController.list)
examTypeRoutes.get("/:id", examTypeController.getById)
examTypeRoutes.patch("/:id", examTypeController.update)
examTypeRoutes.patch("/:id/disable", examTypeController.disable)
examTypeRoutes.patch("/:id/enable", examTypeController.enable)
