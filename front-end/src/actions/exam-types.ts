"use server"

import { revalidatePath } from "next/cache"
import type { CreateExamTypeInput, ExamTypeResponse, UpdateExamTypeInput } from "@shared/schemas/examTypeSchema"
import type { PaginatedResponse } from "@shared/schemas/userSchema"
import { ApiRoutes } from "@/lib/apiRoutes"
import { apiFetch } from "@/lib/apiClient"
import type { ActionResult } from "@/types/api"
import type { ListParams } from "@/utils/query"

const PATH = "/exam-types"

export async function listExamTypes(params?: ListParams): Promise<ActionResult<PaginatedResponse<ExamTypeResponse>>> {
    return apiFetch(ApiRoutes.examTypes.findAll(params))
}

export async function getExamType(id: string): Promise<ActionResult<ExamTypeResponse>> {
    return apiFetch(ApiRoutes.examTypes.findById(id))
}

export async function createExamType(payload: CreateExamTypeInput): Promise<ActionResult<ExamTypeResponse>> {
    const result = await apiFetch<ExamTypeResponse>(ApiRoutes.examTypes.create(), { method: "POST", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function updateExamType(id: string, payload: UpdateExamTypeInput): Promise<ActionResult<ExamTypeResponse>> {
    const result = await apiFetch<ExamTypeResponse>(ApiRoutes.examTypes.update(id), { method: "PATCH", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function disableExamType(id: string): Promise<ActionResult<ExamTypeResponse>> {
    const result = await apiFetch<ExamTypeResponse>(ApiRoutes.examTypes.disable(id), { method: "PATCH" })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function enableExamType(id: string): Promise<ActionResult<ExamTypeResponse>> {
    const result = await apiFetch<ExamTypeResponse>(ApiRoutes.examTypes.enable(id), { method: "PATCH" })
    if (result.ok) revalidatePath(PATH)
    return result
}
