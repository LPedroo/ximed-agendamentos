import type { ExamCategory } from "@shared/schemas/examTypeSchema"
import type { RoomStatus, RoomType } from "@shared/schemas/roomSchema"
import type { AppointmentStatus } from "@shared/schemas/appointmentSchema"
import type { UserRole } from "@shared/schemas/userSchema"

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
    SCHEDULED: "Agendado",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
    ATTENDED: "Atendido",
    NO_SHOW: "Não compareceu",
}

export const USER_ROLE_LABEL: Record<UserRole, string> = {
    ADMIN: "Administrador",
    OPERATOR: "Operador",
    DOCTOR: "Médico",
    PATIENT: "Paciente",
}

export const ROOM_TYPE_LABEL: Record<RoomType, string> = {
    CONSULTATION: "Consultório",
    PROCEDURE: "Procedimentos",
    SURGERY: "Cirurgia",
    LABORATORY: "Laboratório",
}

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
    AVAILABLE: "Disponível",
    MAINTENANCE: "Em manutenção",
    INACTIVE: "Inativa",
}

export const EXAM_CATEGORY_LABEL: Record<ExamCategory, string> = {
    OCCUPATIONAL: "Ocupacional",
    COMPLEMENTARY: "Complementar",
}

// O status do exame é texto livre na API; estes são os valores padronizados.
export const EXAM_STATUS_OPTIONS = ["Pendente", "Em andamento", "Realizado", "Finalizado"]
