import type { Request, Response } from "express"
import {
    createExamTypeSchema,
    updateExamTypeSchema,
    listExamTypesQuerySchema,
    examTypeIdParamSchema,
} from "../../../shared/schemas/examTypeSchema.js"
import { examTypeService } from "../services/examTypeService.js"

export const examTypeController = {
    async create(req: Request, res: Response) {
        const input = createExamTypeSchema.parse(req.body)
        res.status(201).json(await examTypeService.create(input))
    },

    async list(req: Request, res: Response) {
        const query = listExamTypesQuerySchema.parse(req.query)
        res.json(await examTypeService.list(query))
    },

    async getById(req: Request, res: Response) {
        const { id } = examTypeIdParamSchema.parse(req.params)
        res.json(await examTypeService.getById(id))
    },

    async update(req: Request, res: Response) {
        const { id } = examTypeIdParamSchema.parse(req.params)
        const input = updateExamTypeSchema.parse(req.body)
        res.json(await examTypeService.update(id, input))
    },

    async enable(req: Request, res: Response) {
        const { id } = examTypeIdParamSchema.parse(req.params)
        res.json(await examTypeService.enable(id))
    },

    async disable(req: Request, res: Response) {
        const { id } = examTypeIdParamSchema.parse(req.params)
        res.json(await examTypeService.disable(id))
    },
}
