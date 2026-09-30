import type { Request, Response } from "express"
import {
    createRoomSchema,
    updateRoomSchema,
    listRoomsQuerySchema,
    roomIdParamSchema,
} from "../../../shared/schemas/roomSchema.js"
import { roomService } from "../services/roomService.js"

export const roomController = {
    async create(req: Request, res: Response) {
        const input = createRoomSchema.parse(req.body)
        res.status(201).json(await roomService.create(input))
    },

    async list(req: Request, res: Response) {
        const query = listRoomsQuerySchema.parse(req.query)
        res.json(await roomService.list(query))
    },

    async getById(req: Request, res: Response) {
        const { id } = roomIdParamSchema.parse(req.params)
        res.json(await roomService.getById(id))
    },

    async update(req: Request, res: Response) {
        const { id } = roomIdParamSchema.parse(req.params)
        const input = updateRoomSchema.parse(req.body)
        res.json(await roomService.update(id, input))
    },

    async delete(req: Request, res: Response) {
        const { id } = roomIdParamSchema.parse(req.params)
        await roomService.delete(id)
        res.status(204).send()
    },
}
