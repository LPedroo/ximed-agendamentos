import { Router } from "express"
import { roomController } from "../controllers/roomController.js"
import { requireRole } from "../middlewares/require-role.js"

export const roomRoutes = Router()

const canWrite = requireRole("ADMIN", "OPERATOR")

roomRoutes.post("/", canWrite, roomController.create)
roomRoutes.get("/", roomController.list)
roomRoutes.get("/:id", roomController.getById)
roomRoutes.patch("/:id", canWrite, roomController.update)
roomRoutes.delete("/:id", canWrite, roomController.delete)
