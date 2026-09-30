import type { Prisma } from "../../generated/prisma/client.js"

// Dados públicos do usuário: nunca inclui a senha.
export const userSummarySelect = {
    select: { id: true, name: true, email: true, telephone: true, cpf: true, role: true, active: true },
} satisfies { select: Prisma.UserSelect }

export const patientInclude = {
    select: { id: true, user: userSummarySelect },
} satisfies { select: Prisma.PatientSelect }

export const doctorInclude = {
    select: { id: true, crm: true, user: userSummarySelect },
} satisfies { select: Prisma.DoctorSelect }
