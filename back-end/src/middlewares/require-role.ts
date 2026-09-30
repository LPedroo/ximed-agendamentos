import type { RequestHandler } from "express"
import type { UserRole } from "../../generated/prisma/client.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "./errors/HttpError.js"

// Deve rodar depois do `authenticate` (que popula req.user).
export const requireRole = (...roles: UserRole[]): RequestHandler => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new HttpError(403, HTTP_ERROR_MESSAGE.FORBIDDEN, HttpErrorType.FORBIDDEN))
    }
    next()
}
