import { Router } from "express"
import { userController } from "../controllers/userController.js"
import { requireRole } from "../middlewares/require-role.js"

export const userRoutes = Router()

userRoutes.post("/", requireRole("ADMIN"), userController.create)
userRoutes.get("/", requireRole("ADMIN", "OPERATOR", "DOCTOR"), userController.list)
userRoutes.get("/:id", requireRole("ADMIN", "OPERATOR", "DOCTOR"), userController.getById)
userRoutes.patch("/:id", requireRole("ADMIN"), userController.update)
userRoutes.patch("/:id/disable", requireRole("ADMIN"), userController.disable)
userRoutes.patch("/:id/enable", requireRole("ADMIN"), userController.enable)
