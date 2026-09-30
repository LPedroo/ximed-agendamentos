import { Router } from "express"
import { medicalExaminationController } from "../controllers/medicalExaminationController.js"

export const medicalExaminationRoutes = Router()

medicalExaminationRoutes.post("/", medicalExaminationController.create)
medicalExaminationRoutes.get("/", medicalExaminationController.list)
medicalExaminationRoutes.get("/:id", medicalExaminationController.getById)
medicalExaminationRoutes.patch("/:id", medicalExaminationController.update)
medicalExaminationRoutes.delete("/:id", medicalExaminationController.delete)
