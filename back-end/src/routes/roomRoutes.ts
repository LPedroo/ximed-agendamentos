import { Router } from "express"
import { roomController } from "../controllers/roomController.js"

export const roomRoutes = Router()

roomRoutes.post("/", roomController.create)
roomRoutes.get("/", roomController.list)
roomRoutes.get("/:id", roomController.getById)
roomRoutes.patch("/:id", roomController.update)
roomRoutes.delete("/:id", roomController.delete)
