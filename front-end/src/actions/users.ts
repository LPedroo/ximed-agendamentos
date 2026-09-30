"use server"

import { revalidatePath } from "next/cache"
import type { CreateUserInput, PaginatedResponse, UpdateUserInput, UserResponse } from "@shared/schemas/userSchema"
import { ApiRoutes } from "@/lib/apiRoutes"
import { apiFetch } from "@/lib/apiClient"
import type { ActionResult } from "@/types/api"
import type { ListParams } from "@/utils/query"

const PATH = "/users"

export async function listUsers(params?: ListParams): Promise<ActionResult<PaginatedResponse<UserResponse>>> {
    return apiFetch(ApiRoutes.users.findAll(params))
}

export async function getUser(id: string): Promise<ActionResult<UserResponse>> {
    return apiFetch(ApiRoutes.users.findById(id))
}

export async function createUser(payload: CreateUserInput): Promise<ActionResult<UserResponse>> {
    const result = await apiFetch<UserResponse>(ApiRoutes.users.create(), { method: "POST", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function updateUser(id: string, payload: UpdateUserInput): Promise<ActionResult<UserResponse>> {
    const result = await apiFetch<UserResponse>(ApiRoutes.users.update(id), { method: "PATCH", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function disableUser(id: string): Promise<ActionResult<UserResponse>> {
    const result = await apiFetch<UserResponse>(ApiRoutes.users.disable(id), { method: "PATCH" })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function enableUser(id: string): Promise<ActionResult<UserResponse>> {
    const result = await apiFetch<UserResponse>(ApiRoutes.users.enable(id), { method: "PATCH" })
    if (result.ok) revalidatePath(PATH)
    return result
}
