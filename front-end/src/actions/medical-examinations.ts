"use server"

import { revalidatePath } from "next/cache"
import type { AppointmentResponse } from "@shared/schemas/appointmentSchema"
import type { ExamTypeResponse } from "@shared/schemas/examTypeSchema"
import type { MedicalExaminationResponse } from "@shared/schemas/medicalExaminationSchema"
import type { PaginatedResponse, UserResponse } from "@shared/schemas/userSchema"
import { ApiRoutes } from "@/lib/apiRoutes"
import { apiFetch } from "@/lib/apiClient"
import type { ActionResult } from "@/types/api"
import type { MedicalExaminationPayload } from "@/types/medicalExaminations"
import type { ListParams } from "@/utils/query"
import { listAppointments } from "./appointments"
import { listExamTypes } from "./exam-types"
import { listUsers } from "./users"

const PATH = "/medical-examinations"

export async function listMedicalExaminations(params?: ListParams): Promise<ActionResult<PaginatedResponse<MedicalExaminationResponse>>> {
    return apiFetch(ApiRoutes.medicalExaminations.findAll(params))
}

export async function getMedicalExamination(id: string): Promise<ActionResult<MedicalExaminationResponse>> {
    return apiFetch(ApiRoutes.medicalExaminations.findById(id))
}

// Criar exame vinculado a um agendamento confirmado marca o agendamento como atendido (regra da API).
export async function createMedicalExamination(payload: MedicalExaminationPayload): Promise<ActionResult<MedicalExaminationResponse>> {
    const result = await apiFetch<MedicalExaminationResponse>(ApiRoutes.medicalExaminations.create(), { method: "POST", body: payload })
    if (result.ok) {
        revalidatePath(PATH)
        revalidatePath("/appointments")
    }
    return result
}

export async function updateMedicalExamination(id: string, payload: MedicalExaminationPayload): Promise<ActionResult<MedicalExaminationResponse>> {
    const result = await apiFetch<MedicalExaminationResponse>(ApiRoutes.medicalExaminations.update(id), { method: "PATCH", body: payload })
    if (result.ok) {
        revalidatePath(PATH)
        revalidatePath("/appointments")
    }
    return result
}

export async function deleteMedicalExamination(id: string): Promise<ActionResult<null>> {
    const result = await apiFetch<null>(ApiRoutes.medicalExaminations.delete(id), { method: "DELETE" })
    if (result.ok) {
        revalidatePath(PATH)
        revalidatePath("/appointments")
    }
    return result
}

export type ExaminationFormOptions = {
    patients: UserResponse[]
    doctors: UserResponse[]
    examTypes: ExamTypeResponse[]
    appointments: AppointmentResponse[]
}

// Dados dos selects do formulário (limite de 100 por lista, o máximo da API).
// Só agendamentos confirmados ou atendidos podem receber exames.
export async function getExaminationFormOptions(): Promise<ActionResult<ExaminationFormOptions>> {
    const [patients, doctors, examTypes, confirmed, attended] = await Promise.all([
        listUsers({ role: "PATIENT", limit: 100 }),
        listUsers({ role: "DOCTOR", limit: 100 }),
        listExamTypes({ limit: 100 }),
        listAppointments({ status: "CONFIRMED", limit: 100 }),
        listAppointments({ status: "ATTENDED", limit: 100 }),
    ])

    for (const result of [patients, doctors, examTypes, confirmed, attended]) if (!result.ok) return result

    return {
        ok: true,
        data: {
            patients: patients.ok ? patients.data.data : [],
            doctors: doctors.ok ? doctors.data.data : [],
            examTypes: examTypes.ok ? examTypes.data.data : [],
            appointments: [...(confirmed.ok ? confirmed.data.data : []), ...(attended.ok ? attended.data.data : [])],
        },
    }
}
