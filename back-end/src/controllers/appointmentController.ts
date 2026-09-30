import type { Request, Response } from "express"
import {
    createAppointmentSchema,
    updateAppointmentSchema,
    listAppointmentsQuerySchema,
    appointmentIdParamSchema,
} from "../../../shared/schemas/appointmentSchema.js"
import { patientScope } from "../lib/patientScope.js"
import { appointmentService } from "../services/appointmentService.js"

const scopeFilter = (req: Request) => {
    const patientId = patientScope(req)
    return patientId === undefined ? {} : { patientId }
}

export const appointmentController = {
    async create(req: Request, res: Response) {
        const input = createAppointmentSchema.parse(req.body)
        res.status(201).json(await appointmentService.create(input, req.user!.id))
    },

    async list(req: Request, res: Response) {
        const query = listAppointmentsQuerySchema.parse(req.query)
        res.json(await appointmentService.list({ ...query, ...scopeFilter(req) }))
    },

    async getById(req: Request, res: Response) {
        const { id } = appointmentIdParamSchema.parse(req.params)
        res.json(await appointmentService.getById(id, patientScope(req)))
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
