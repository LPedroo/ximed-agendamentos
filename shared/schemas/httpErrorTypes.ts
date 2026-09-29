export const HttpErrorType = {
    USER_EXISTS: "USER_EXISTS",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_DISABLED: "USER_DISABLED",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    FORBIDDEN: "FORBIDDEN",
    DATABASE_UNREACHABLE: "DATABASE_UNREACHABLE",
} as const

export type HttpErrorType = (typeof HttpErrorType)[keyof typeof HttpErrorType]

export const HTTP_ERROR_MESSAGE: Record<HttpErrorType, string> = {
    USER_EXISTS: "Já existe um usuário cadastrado com esses dados.",
    USER_NOT_FOUND: "Usuário não encontrado.",
    USER_DISABLED: "Este usuário está desativado.",
    INVALID_CREDENTIALS: "E-mail ou senha inválidos.",
    FORBIDDEN: "Você não tem permissão para realizar esta ação.",
    DATABASE_UNREACHABLE: "Não foi possível conectar ao servidor. Tente novamente em alguns instantes.",
}
