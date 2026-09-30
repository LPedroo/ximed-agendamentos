import type { Request, Response } from "express"
import {
    createAppointmentSchema,
    updateAppointmentSchema,
    listAppointmentsQuerySchema,
    appointmentIdParamSchema,
} from "../../../shared/schemas/appointmentSchema.js"
import { appointmentService } from "../services/appointmentService.js"

export const appointmentController = {
    async create(req: Request, res: Response) {
        const input = createAppointmentSchema.parse(req.body)
        res.status(201).json(await appointmentService.create(input, req.user!.id))
    },

    async list(req: Request, res: Response) {
        const query = listAppointmentsQuerySchema.parse(req.query)
        res.json(await appointmentService.list(query))
    },

    async getById(req: Request, res: Response) {
        const { id } = appointmentIdParamSchema.parse(req.params)
        res.json(await appointmentService.getById(id))
    },

    async update(req: Request, res: Response) {
        const { id } = appointmentIdParamSchema.parse(req.params)
        const input = updateAppointmentSchema.parse(req.body)
        res.json(await appointmentService.update(id, input))
    },

    async cancel(req: Request, res: Response) {
        const { id } = appointmentIdParamSchema.parse(req.params)
        res.json(await appointmentService.cancel(id))
    },
}
