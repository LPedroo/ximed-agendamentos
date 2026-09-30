import { Router } from "express"
import { medicalExaminationController } from "../controllers/medicalExaminationController.js"
import { requireRole } from "../middlewares/require-role.js"

export const medicalExaminationRoutes = Router()

const canWrite = requireRole("ADMIN", "DOCTOR", "OPERATOR")

medicalExaminationRoutes.post("/", canWrite, medicalExaminationController.create)
medicalExaminationRoutes.get("/", medicalExaminationController.list)
medicalExaminationRoutes.get("/:id", medicalExaminationController.getById)
medicalExaminationRoutes.patch("/:id", canWrite, medicalExaminationController.update)
medicalExaminationRoutes.delete("/:id", canWrite, medicalExaminationController.delete)
