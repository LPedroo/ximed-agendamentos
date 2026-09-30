"use server"

import { revalidatePath } from "next/cache"
import type { CreateRoomInput, RoomResponse, UpdateRoomInput } from "@shared/schemas/roomSchema"
import type { PaginatedResponse } from "@shared/schemas/userSchema"
import { ApiRoutes } from "@/lib/apiRoutes"
import { apiFetch } from "@/lib/apiClient"
import type { ActionResult } from "@/types/api"
import type { ListParams } from "@/utils/query"

const PATH = "/rooms"

export async function listRooms(params?: ListParams): Promise<ActionResult<PaginatedResponse<RoomResponse>>> {
    return apiFetch(ApiRoutes.rooms.findAll(params))
}

export async function getRoom(id: string): Promise<ActionResult<RoomResponse>> {
    return apiFetch(ApiRoutes.rooms.findById(id))
}

export async function createRoom(payload: CreateRoomInput): Promise<ActionResult<RoomResponse>> {
    const result = await apiFetch<RoomResponse>(ApiRoutes.rooms.create(), { method: "POST", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function updateRoom(id: string, payload: UpdateRoomInput): Promise<ActionResult<RoomResponse>> {
    const result = await apiFetch<RoomResponse>(ApiRoutes.rooms.update(id), { method: "PATCH", body: payload })
    if (result.ok) revalidatePath(PATH)
    return result
}

export async function deleteRoom(id: string): Promise<ActionResult<null>> {
    const result = await apiFetch<null>(ApiRoutes.rooms.delete(id), { method: "DELETE" })
    if (result.ok) revalidatePath(PATH)
    return result
}
