import type { Request, Response } from "express"
import {
    createMedicalExaminationSchema,
    updateMedicalExaminationSchema,
    listMedicalExaminationsQuerySchema,
    medicalExaminationIdParamSchema,
} from "../../../shared/schemas/medicalExaminationSchema.js"
import { patientScope } from "../lib/patientScope.js"
import { medicalExaminationService } from "../services/medicalExaminationService.js"

const scopeFilter = (req: Request) => {
    const patientId = patientScope(req)
    return patientId === undefined ? {} : { patientId }
}

export const medicalExaminationController = {
    async create(req: Request, res: Response) {
        const input = createMedicalExaminationSchema.parse(req.body)
        res.status(201).json(await medicalExaminationService.create(input, req.user!.id))
    },

    async list(req: Request, res: Response) {
        const query = listMedicalExaminationsQuerySchema.parse(req.query)
        res.json(await medicalExaminationService.list({ ...query, ...scopeFilter(req) }))
    },

    async getById(req: Request, res: Response) {
        const { id } = medicalExaminationIdParamSchema.parse(req.params)
        res.json(await medicalExaminationService.getById(id, patientScope(req)))
    },

    async update(req: Request, res: Response) {
        const { id } = medicalExaminationIdParamSchema.parse(req.params)
        const input = updateMedicalExaminationSchema.parse(req.body)
        res.json(await medicalExaminationService.update(id, input))
    },

    async delete(req: Request, res: Response) {
        const { id } = medicalExaminationIdParamSchema.parse(req.params)
        await medicalExaminationService.delete(id)
        res.status(204).send()
    },
}
