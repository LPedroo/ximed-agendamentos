import { Router } from "express"
import { authRoutes } from "./authRoutes.js"
import { userRoutes } from "./userRoutes.js"
import { examTypeRoutes } from "./examTypeRoutes.js"
import { appointmentRoutes } from "./appointmentRoutes.js"
import { roomRoutes } from "./roomRoutes.js"
import { medicalExaminationRoutes } from "./medicalExaminationRoutes.js"

export const apiRoutes = Router()

apiRoutes.use("/users", userRoutes)
apiRoutes.use("/auth", authRoutes)
apiRoutes.use("/medical-examinations", medicalExaminationRoutes)
apiRoutes.use("/rooms", roomRoutes)
apiRoutes.use("/appointments", appointmentRoutes)
apiRoutes.use("/exam-types", examTypeRoutes)
