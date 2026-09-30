import { Router } from "express"
import { authController } from "../controllers/authController.js"
import { loginRateLimit } from "../middlewares/rate-limit.js"

export const authRoutes = Router()

authRoutes.post("/login", loginRateLimit, authController.login)
authRoutes.post("/logout", authController.logout)
