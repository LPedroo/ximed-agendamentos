import { Router } from "express"
import { authRoutes } from "./authRoutes.js"
import { userRoutes } from "./userRoutes.js"
import { medicalExaminationRoutes } from "./medicalExaminationRoutes.js"

export const apiRoutes = Router()

apiRoutes.use("/users", userRoutes)
apiRoutes.use("/auth", authRoutes)
apiRoutes.use("/medical-examinations", medicalExaminationRoutes)
