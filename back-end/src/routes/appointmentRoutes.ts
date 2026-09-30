import { Router } from "express"
import { appointmentController } from "../controllers/appointmentController.js"
import { requireRole } from "../middlewares/require-role.js"

export const appointmentRoutes = Router()

const canWrite = requireRole("ADMIN", "OPERATOR")

appointmentRoutes.post("/", canWrite, appointmentController.create)
appointmentRoutes.get("/", appointmentController.list)
appointmentRoutes.get("/:id", appointmentController.getById)
appointmentRoutes.patch("/:id", canWrite, appointmentController.update)
appointmentRoutes.delete("/:id", canWrite, appointmentController.delete)
appointmentRoutes.patch("/:id/cancel", canWrite, appointmentController.cancel)
