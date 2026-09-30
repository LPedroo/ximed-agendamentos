import type { RequestHandler } from "express"
import { rateLimit } from "express-rate-limit"
import { HttpError } from "./errors/HttpError.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"

const createLimiter = (windowMs: number, limit: number): RequestHandler =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        handler: (_req, _res, next) => {
            next(new HttpError(429, HTTP_ERROR_MESSAGE.TOO_MANY_REQUESTS, HttpErrorType.TOO_MANY_REQUESTS))
        },
    })

const envNumber = (name: string, fallback: number) => {
    const value = Number(process.env[name])
    return Number.isInteger(value) && value > 0 ? value : fallback
}

// Limite geral: todas as rotas da API, por IP (RATE_LIMIT_MAX requisições por minuto).
export const globalRateLimit = createLimiter(60 * 1000, envNumber("RATE_LIMIT_MAX", 100))

// Limite estrito: tentativas de login, por IP (mitiga brute force).
// (LOGIN_RATE_LIMIT_MAX tentativas a cada 15 minutos.)
export const loginRateLimit = createLimiter(15 * 60 * 1000, envNumber("LOGIN_RATE_LIMIT_MAX", 10))
