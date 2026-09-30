import { Router } from "express"
import { examTypeController } from "../controllers/examTypeController.js"
import { requireRole } from "../middlewares/require-role.js"

export const examTypeRoutes = Router()

const canWrite = requireRole("ADMIN", "OPERATOR")

examTypeRoutes.post("/", canWrite, examTypeController.create)
examTypeRoutes.get("/", examTypeController.list)
examTypeRoutes.get("/:id", examTypeController.getById)
examTypeRoutes.patch("/:id", canWrite, examTypeController.update)
examTypeRoutes.patch("/:id/disable", canWrite, examTypeController.disable)
examTypeRoutes.patch("/:id/enable", canWrite, examTypeController.enable)
