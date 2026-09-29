import type { ErrorRequestHandler } from "express";
import { HttpError } from "./HttpError.js";
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../../shared/schemas/httpErrorTypes.js";
import { Prisma } from "../../../generated/prisma/client.js";

export const errorHandlerMiddleware: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    if (error instanceof HttpError) {
        res.status(error.status).json({ status: error.status, error: error.code, message: error.message });
    } else if (
        error instanceof Prisma.PrismaClientInitializationError ||
        (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1001")
    ) {
        res.status(503).json({
            status: 503,
            error: HttpErrorType.DATABASE_UNREACHABLE,
            message: HTTP_ERROR_MESSAGE.DATABASE_UNREACHABLE,
        });
    } else if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Erro interno no servidor desconhecido" });
    }
};
