import { z } from "zod"
import type { DoctorSummary, PatientSummary, UserSummary } from "./summaries.js"
import type { RoomResponse } from "./roomSchema.js"
import type { ExamTypeResponse } from "./examTypeSchema.js"

export const AppointmentStatusSchema = z.enum(["SCHEDULED", "CONFIRMED", "CANCELLED", "ATTENDED", "NO_SHOW"])
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>

export const createAppointmentSchema = z.object({
    patientId: z.string().min(1),
    requestingDoctorId: z.string().min(1),
    roomId: z.string().min(1).optional(),
    examTypeId: z.string().min(1).optional(),
    scheduledAt: z.coerce.date(),
    estimatedDuration: z.number().int().min(1).max(480).optional(),
    observations: z.string().trim().min(1).optional(),
    createdById: z.string().min(1).optional(),
})
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>

export const updateAppointmentSchema = createAppointmentSchema
    .omit({ createdById: true })
    .extend({
        roomId: z.string().min(1).nullable().optional(),
        examTypeId: z.string().min(1).nullable().optional(),
        estimatedDuration: z.number().int().min(1).max(480).nullable().optional(),
        observations: z.string().trim().min(1).nullable().optional(),
        status: AppointmentStatusSchema.optional(),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Informe ao menos um campo para atualizar.",
    })
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>

export const appointmentIdParamSchema = z.object({ id: z.string().min(1) })

export type AppointmentExaminationResponse = {
    id: string
    examTypeId: string
    examType: ExamTypeResponse
    patientId: string
    doctorId: string
    appointmentId: string | null
    datePerformed: string | null
    dateResult: string | null
    status: string | null
    result: string | null
    report: string | null
    createdById: string | null
    createdAt: string
    updatedAt: string
}

export type AppointmentResponse = {
    id: string
    patientId: string
    requestingDoctorId: string
    roomId: string | null
    examTypeId: string | null
    scheduledAt: string
    estimatedDuration: number | null
    status: AppointmentStatus
    observations: string | null
    createdById: string | null
    patient: PatientSummary
    requestingDoctor: DoctorSummary
    room: RoomResponse | null
    examType: ExamTypeResponse | null
    examinations: AppointmentExaminationResponse[]
    createdBy: UserSummary | null
    createdAt: string
    updatedAt: string
}

export const listAppointmentsQuerySchema = z.object({
    patientId: z.string().min(1).optional(),
    requestingDoctorId: z.string().min(1).optional(),
    roomId: z.string().min(1).optional(),
    status: AppointmentStatusSchema.optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>
