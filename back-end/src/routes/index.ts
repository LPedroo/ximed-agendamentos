import { Router } from "express"
import { authRoutes } from "./authRoutes.js"
import { userRoutes } from "./userRoutes.js"

export const apiRoutes = Router()

apiRoutes.use("/users", userRoutes)
apiRoutes.use("/auth", authRoutes)
