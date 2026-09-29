import type { Request, Response } from "express"
import {
    createUserSchema,
    updateUserSchema,
    listUsersQuerySchema,
    userIdParamSchema,
} from "../../../shared/schemas/userSchema.js"
import { userService } from "../services/userService.js"

export const userController = {
    async create(req: Request, res: Response) {
        const input = createUserSchema.parse(req.body)
        res.status(201).json(await userService.create(input))
    },

    async list(req: Request, res: Response) {
        const query = listUsersQuerySchema.parse(req.query)
        res.json(await userService.list(query))
    },

    async getById(req: Request, res: Response) {
        const { id } = userIdParamSchema.parse(req.params)
        res.json(await userService.getById(id))
    },

    async update(req: Request, res: Response) {
        const { id } = userIdParamSchema.parse(req.params)
        const input = updateUserSchema.parse(req.body)
        res.json(await userService.update(id, input))
    },

    async enable(req: Request, res: Response) {
        const { id } = userIdParamSchema.parse(req.params)
        res.json(await userService.enable(id))
    },

    async disable(req: Request, res: Response) {
        const { id } = userIdParamSchema.parse(req.params)
        res.json(await userService.disable(id))
    },
}
