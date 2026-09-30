export const HttpErrorType = {
    USER_EXISTS: "USER_EXISTS",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_DISABLED: "USER_DISABLED",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    FORBIDDEN: "FORBIDDEN",
    CRM_REQUIRED: "CRM_REQUIRED",
    CRM_EXISTS: "CRM_EXISTS",
    ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
    ROOM_IN_USE: "ROOM_IN_USE",
    EXAM_NOT_FOUND: "EXAM_NOT_FOUND",
    SELF_EXAMINATION_NOT_ALLOWED: "SELF_EXAMINATION_NOT_ALLOWED",
    PATIENT_NOT_FOUND: "PATIENT_NOT_FOUND",
    DOCTOR_NOT_FOUND: "DOCTOR_NOT_FOUND",
    DATABASE_UNREACHABLE: "DATABASE_UNREACHABLE",
} as const

export type HttpErrorType = (typeof HttpErrorType)[keyof typeof HttpErrorType]

export const HTTP_ERROR_MESSAGE: Record<HttpErrorType, string> = {
    USER_EXISTS: "Já existe um usuário cadastrado com esses dados.",
    USER_NOT_FOUND: "Usuário não encontrado.",
    USER_DISABLED: "Este usuário está desativado.",
    INVALID_CREDENTIALS: "E-mail ou senha inválidos.",
    FORBIDDEN: "Você não tem permissão para realizar esta ação.",
    CRM_REQUIRED: "Informe o CRM para usuários com role DOCTOR.",
    CRM_EXISTS: "Já existe um médico cadastrado com esse CRM.",
    ROOM_NOT_FOUND: "Sala não encontrada.",
    ROOM_IN_USE: "Não é possível excluir uma sala que possui agendamentos.",
    EXAM_NOT_FOUND: "Exame não encontrado.",
    SELF_EXAMINATION_NOT_ALLOWED: "O médico não pode ser o próprio paciente do exame.",
    PATIENT_NOT_FOUND: "Paciente não encontrado.",
    DOCTOR_NOT_FOUND: "Médico não encontrado.",
    DATABASE_UNREACHABLE: "Não foi possível conectar ao servidor. Tente novamente em alguns instantes.",
}
