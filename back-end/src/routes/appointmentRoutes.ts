import { Router } from "express"
import { appointmentController } from "../controllers/appointmentController.js"

export const appointmentRoutes = Router()

appointmentRoutes.post("/", appointmentController.create)
appointmentRoutes.get("/", appointmentController.list)
appointmentRoutes.get("/:id", appointmentController.getById)
appointmentRoutes.patch("/:id", appointmentController.update)
appointmentRoutes.patch("/:id/cancel", appointmentController.cancel)
