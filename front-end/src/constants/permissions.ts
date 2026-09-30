import type { UserRole } from "@shared/schemas/userSchema"

// Espelha a matriz de permissões da API. A API é quem barra de fato; aqui só escondemos o que não faz sentido mostrar.
export const APPOINTMENT_WRITE_ROLES: UserRole[] = ["ADMIN", "OPERATOR"]
export const EXAMINATION_WRITE_ROLES: UserRole[] = ["ADMIN", "DOCTOR", "OPERATOR"]
export const USER_READ_ROLES: UserRole[] = ["ADMIN", "OPERATOR", "DOCTOR"]
export const USER_WRITE_ROLES: UserRole[] = ["ADMIN"]
export const ROOM_READ_ROLES: UserRole[] = ["ADMIN", "OPERATOR", "DOCTOR"]
export const ROOM_WRITE_ROLES: UserRole[] = ["ADMIN", "OPERATOR"]
export const EXAM_TYPE_READ_ROLES: UserRole[] = ["ADMIN", "OPERATOR", "DOCTOR"]
export const EXAM_TYPE_WRITE_ROLES: UserRole[] = ["ADMIN", "OPERATOR"]

export const hasRole = (role: UserRole, allowed: UserRole[]) => allowed.includes(role)
