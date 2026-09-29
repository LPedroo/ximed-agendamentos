import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { LoginInput } from "../../../shared/schemas/userSchema.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "../middlewares/errors/HttpError.js"
import { userRepository } from "../repositories/userRepository.js"

const TOKEN_EXPIRES_IN = "4h"

export const authService = {
    async login({ email, password }: LoginInput) {
        const user = await userRepository.findAuthByEmail(email)
        const validPassword = user && (await bcrypt.compare(password, user.password))

        if (!user || !validPassword) {
            throw new HttpError(
                401,
                HTTP_ERROR_MESSAGE.INVALID_CREDENTIALS,
                HttpErrorType.INVALID_CREDENTIALS,
            )
        }
        if (!user.active) {
            throw new HttpError(403, HTTP_ERROR_MESSAGE.USER_DISABLED, HttpErrorType.USER_DISABLED)
        }

        return jwt.sign({ sub: user.id, role: user.role }, process.env["JWT_SECRET"]!, {
            expiresIn: TOKEN_EXPIRES_IN,
        })
    },
}
