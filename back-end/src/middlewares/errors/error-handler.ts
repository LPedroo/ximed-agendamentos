import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "./HttpError.js";
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../../shared/schemas/httpErrorTypes.js";
import { Prisma } from "../../../generated/prisma/client.js";

export const errorHandlerMiddleware: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    if (res.headersSent) return next(error);

    if (error instanceof HttpError) {
        res.status(error.status).json({ status: error.status, error: error.code, message: error.message });
    } else if (error instanceof ZodError) {
        res.status(400).json({
            status: 400,
            error: HttpErrorType.VALIDATION_ERROR,
            message: HTTP_ERROR_MESSAGE.VALIDATION_ERROR,
            issues: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        });
    } else if (error instanceof SyntaxError && "type" in error && error.type === "entity.parse.failed") {
        res.status(400).json({
            status: 400,
            error: HttpErrorType.INVALID_JSON,
            message: HTTP_ERROR_MESSAGE.INVALID_JSON,
        });
    } else if (
        error instanceof Prisma.PrismaClientInitializationError ||
        (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P1001")
    ) {
        res.status(503).json({
            status: 503,
            error: HttpErrorType.DATABASE_UNREACHABLE,
            message: HTTP_ERROR_MESSAGE.DATABASE_UNREACHABLE,
        });
    } else {
        console.error(error);
        res.status(500).json({
            status: 500,
            error: HttpErrorType.INTERNAL_ERROR,
            message: HTTP_ERROR_MESSAGE.INTERNAL_ERROR,
        });
    }
};
