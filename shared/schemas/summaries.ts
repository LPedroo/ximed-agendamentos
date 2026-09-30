import type { UserRole } from "./userSchema.js"

export type UserSummary = {
    id: string
    name: string
    email: string
    telephone: string | null
    cpf: string
    role: UserRole
    active: boolean
}

export type PatientSummary = { id: string; user: UserSummary }

export type DoctorSummary = { id: string; crm: string; user: UserSummary }
