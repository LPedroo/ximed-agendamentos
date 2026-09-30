import { z } from "zod"
import type { DoctorSummary, PatientSummary, UserSummary } from "./summaries.js"
import type { ExamTypeResponse } from "./examTypeSchema.js"
import type { AppointmentStatus } from "./appointmentSchema.js"

export const createMedicalExaminationSchema = z.object({
    examTypeId: z.string().min(1),
    patientId: z.string().min(1),
    doctorId: z.string().min(1),
    appointmentId: z.string().min(1).optional(),
    datePerformed: z.coerce.date().optional(),
    dateResult: z.coerce.date().optional(),
    status: z.string().trim().min(1).optional(),
    result: z.string().trim().min(1).optional(),
    report: z.string().trim().min(1).optional(),
    createdById: z.string().min(1).optional(),
})
export type CreateMedicalExaminationInput = z.infer<typeof createMedicalExaminationSchema>

export const updateMedicalExaminationSchema = createMedicalExaminationSchema
    .omit({ createdById: true })
    .extend({
        appointmentId: z.string().min(1).nullable().optional(),
        datePerformed: z.coerce.date().nullable().optional(),
        dateResult: z.coerce.date().nullable().optional(),
        status: z.string().trim().min(1).nullable().optional(),
        result: z.string().trim().min(1).nullable().optional(),
        report: z.string().trim().min(1).nullable().optional(),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Informe ao menos um campo para atualizar.",
    })
export type UpdateMedicalExaminationInput = z.infer<typeof updateMedicalExaminationSchema>

export const medicalExaminationIdParamSchema = z.object({ id: z.string().min(1) })

export type MedicalExaminationResponse = {
    id: string
    examTypeId: string
    patientId: string
    doctorId: string
    appointmentId: string | null
    datePerformed: string | null
    dateResult: string | null
    status: string | null
    result: string | null
    report: string | null
    createdById: string | null
    examType: ExamTypeResponse
    patient: PatientSummary
    doctor: DoctorSummary
    appointment: { id: string; scheduledAt: string; status: AppointmentStatus } | null
    createdBy: UserSummary | null
    createdAt: string
    updatedAt: string
}

export const listMedicalExaminationsQuerySchema = z.object({
    search: z.string().trim().min(1).optional(),
    examTypeId: z.string().min(1).optional(),
    patientId: z.string().min(1).optional(),
    doctorId: z.string().min(1).optional(),
    appointmentId: z.string().min(1).optional(),
    status: z.string().trim().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type ListMedicalExaminationsQuery = z.infer<typeof listMedicalExaminationsQuerySchema>
