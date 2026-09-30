"use server"

import { revalidatePath } from "next/cache"
import type { AppointmentResponse } from "@shared/schemas/appointmentSchema"
import type { ExamTypeResponse } from "@shared/schemas/examTypeSchema"
import type { RoomResponse } from "@shared/schemas/roomSchema"
import type { PaginatedResponse, UserResponse } from "@shared/schemas/userSchema"
import { ApiRoutes } from "@/lib/apiRoutes"
import { apiFetch } from "@/lib/apiClient"
import { listExamTypes } from "./exam-types"
import { listRooms } from "./rooms"
import { listUsers } from "./users"
import type { AppointmentPayload, AppointmentReschedulePayload } from "@/types/appointments"
import type { ActionResult } from "@/types/api"
import type { ListParams } from "@/utils/query"

const PATH = "/appointments"

export async function listAppointments(params?: ListParams): Promise<ActionResult<PaginatedResponse<AppointmentResponse>>> {
    return apiFetch(ApiRoutes.appointments.findAll(params))
}

// Todos os agendamentos de um intervalo (percorre as páginas de 100; teto de 10 páginas).
export async function listAppointmentsBetween(params: { from: string; to: string; status?: string | undefined }): Promise<ActionResult<AppointmentResponse[]>> {
    const appointments: AppointmentResponse[] = []

    for (let page = 1; page <= 10; page++) {
        const result = await apiFetch<PaginatedResponse<AppointmentResponse>>(ApiRoutes.appointments.findAll({ ...params, page, limit: 100 }))
        if (!result.ok) return result
        appointments.push(...result.data.data)
        if (page >= result.data.meta.totalPages) break
    }

    return { ok: true, data: appointments }
}

export async function getAppointment(id: string): Promise<ActionResult<AppointmentResponse>> {
    return apiFetch(ApiRoutes.appointments.findById(id))
}

export async function createAppointment(payload: AppointmentPayload): Promise<ActionResult<AppointmentResponse>> {
    const result = await apiFetch<AppointmentResponse>(ApiRoutes.appointments.create(), { method: "POST", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function updateAppointment(id: string, payload: AppointmentReschedulePayload): Promise<ActionResult<AppointmentResponse>> {
    const result = await apiFetch<AppointmentResponse>(ApiRoutes.appointments.update(id), { method: "PATCH", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function cancelAppointment(id: string): Promise<ActionResult<AppointmentResponse>> {
    const result = await apiFetch<AppointmentResponse>(ApiRoutes.appointments.cancel(id), { method: "PATCH" })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function deleteAppointment(id: string): Promise<ActionResult<null>> {
    const result = await apiFetch<null>(ApiRoutes.appointments.delete(id), { method: "DELETE" })
    if (result.ok) revalidatePath(PATH)
    return result
}

export type AppointmentFormOptions = {
    patients: UserResponse[]
    doctors: UserResponse[]
    rooms: RoomResponse[]
    examTypes: ExamTypeResponse[]
}

// Dados dos selects do formulário (limite de 100 por lista, o máximo da API).
export async function getAppointmentFormOptions(): Promise<ActionResult<AppointmentFormOptions>> {
    const [patients, doctors, rooms, examTypes] = await Promise.all([
        listUsers({ role: "PATIENT", limit: 100 }),
        listUsers({ role: "DOCTOR", limit: 100 }),
        listRooms({ status: "AVAILABLE", limit: 100 }),
        listExamTypes({ limit: 100 }),
    ])

    for (const result of [patients, doctors, rooms, examTypes]) if (!result.ok) return result

    return {
        ok: true,
        data: {
            patients: patients.ok ? patients.data.data : [],
            doctors: doctors.ok ? doctors.data.data : [],
            rooms: rooms.ok ? rooms.data.data : [],
            examTypes: examTypes.ok ? examTypes.data.data : [],
        },
    }
}
