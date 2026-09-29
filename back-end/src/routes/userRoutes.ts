import { Router } from "express"
import { userController } from "../controllers/userController.js"

export const userRoutes = Router()

userRoutes.post("/", userController.create)
userRoutes.get("/", userController.list)
userRoutes.get("/:id", userController.getById)
userRoutes.patch("/:id", userController.update)
userRoutes.patch("/:id/disable", userController.disable)
userRoutes.patch("/:id/enable", userController.enable)
