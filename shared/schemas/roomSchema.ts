import { z } from "zod"

export const RoomTypeSchema = z.enum(["CONSULTATION", "PROCEDURE", "SURGERY", "LABORATORY"])
export type RoomType = z.infer<typeof RoomTypeSchema>

export const RoomStatusSchema = z.enum(["AVAILABLE", "MAINTENANCE", "INACTIVE"])
export type RoomStatus = z.infer<typeof RoomStatusSchema>

export const createRoomSchema = z.object({
    name: z.string().trim().min(2),
    roomType: RoomTypeSchema,
    capacity: z.number().int().min(1),
    status: RoomStatusSchema.optional(),
})
export type CreateRoomInput = z.infer<typeof createRoomSchema>

export const updateRoomSchema = createRoomSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Informe ao menos um campo para atualizar.",
    })
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>

export const roomIdParamSchema = z.object({ id: z.string().min(1) })

export type RoomResponse = {
    id: string
    name: string
    roomType: RoomType
    capacity: number
    status: RoomStatus
}

export const listRoomsQuerySchema = z.object({
    search: z.string().trim().min(1).optional(),
    roomType: RoomTypeSchema.optional(),
    status: RoomStatusSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type ListRoomsQuery = z.infer<typeof listRoomsQuerySchema>
