import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { userRepository } from "../repositories/userRepository.js"
import { HttpError } from "./errors/HttpError.js"

const unauthorized = () =>
    new HttpError(401, HTTP_ERROR_MESSAGE.UNAUTHORIZED, HttpErrorType.UNAUTHORIZED)

// Valida o JWT do cookie e popula req.user com dados atuais do banco
// (a role vem do banco, não do token, então mudanças valem na hora).
export const authenticate: RequestHandler = async (req, _res, next) => {
    try {
        const token: unknown = req.cookies?.["token"]
        if (typeof token !== "string" || !token) throw unauthorized()

        let sub: unknown
        try {
            sub = jwt.verify(token, process.env["JWT_SECRET"]!).sub
        } catch {
            throw unauthorized()
        }
        if (typeof sub !== "string") throw unauthorized()

        const user = await userRepository.findSessionById(sub)
        if (!user) throw unauthorized()
        if (!user.active) {
            throw new HttpError(403, HTTP_ERROR_MESSAGE.USER_DISABLED, HttpErrorType.USER_DISABLED)
        }

        req.user = { id: user.id, role: user.role, patientId: user.patient?.id ?? null }
        next()
    } catch (error) {
        next(error)
    }
}
