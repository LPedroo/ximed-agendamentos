import type { Request, Response } from "express"
import { loginSchema } from "../../../shared/schemas/userSchema.js"
import { userService } from "../services/userService.js"
import { authService } from "../services/authService.js"

const COOKIE_MAX_AGE_MS = 4 * 60 * 60 * 1000 // igual à expiração do JWT (4h)

export const authController = {
    async login(req: Request, res: Response) {
        const input = loginSchema.parse(req.body)
        const token = await authService.login(input)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env["NODE_ENV"] === "production",
            maxAge: COOKIE_MAX_AGE_MS,
        })
        res.status(204).send()
    },

    async me(req: Request, res: Response) {
        res.json(await userService.getById(req.user!.id))
    },

    logout(_req: Request, res: Response) {
        res.clearCookie("token")
        res.status(204).send()
    },
}
