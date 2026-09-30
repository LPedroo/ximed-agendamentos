import { prisma } from "../lib/prisma.js"
import type { Prisma } from "../../generated/prisma/client.js"
import { patientInclude, doctorInclude, userSummarySelect } from "./includes.js"

const appointmentInclude = {
    patient: patientInclude,
    requestingDoctor: doctorInclude,
    room: true,
    examType: true,
    examinations: { include: { examType: true }, orderBy: { createdAt: "asc" } },
    createdBy: userSummarySelect,
} satisfies Prisma.AppointmentInclude

import { omitUndefined as omitEmpty } from "../lib/omitUndefined.js"

export const appointmentRepository = {
    create: (data: Prisma.AppointmentUncheckedCreateInput) => prisma.appointment.create({ data, include: appointmentInclude }),

    async findPaginated({
        from,
        to,
        skip,
        take,
        ...filters
    }: {
        patientId?: string | undefined
        requestingDoctorId?: string | undefined
        roomId?: string | undefined
        status?: Prisma.AppointmentWhereInput["status"]
        from?: Date | undefined
        to?: Date | undefined
        skip: number
        take: number
    }) {
        const where: Prisma.AppointmentWhereInput = {
            ...omitEmpty(filters),
            ...((from || to) && { scheduledAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }),
        }

        const [data, total] = await prisma.$transaction([
            prisma.appointment.findMany({ where, include: appointmentInclude, orderBy: { scheduledAt: "asc" }, skip, take }),
            prisma.appointment.count({ where }),
        ])
        return { data, total }
    },

    findById: (id: string) => prisma.appointment.findUnique({ where: { id }, include: appointmentInclude }),

    findExamType: (id: string) => prisma.examType.findUnique({ where: { id }, select: { active: true } }),

    findRoom: (id: string) => prisma.room.findUnique({ where: { id }, select: { status: true } }),

    findActiveStartingBetween: ({
        from,
        to,
        roomId,
        doctorId,
        patientId,
        excludeId,
    }: {
        from: Date
        to: Date
        roomId?: string | null | undefined
        doctorId: string
        patientId: string
        excludeId?: string | undefined
    }) =>
        prisma.appointment.findMany({
            where: {
                status: { in: ["SCHEDULED", "CONFIRMED"] },
                scheduledAt: { gte: from, lt: to },
                ...(excludeId && { id: { not: excludeId } }),
                OR: [
                    { requestingDoctorId: doctorId },
                    { patientId },
                    ...(roomId ? [{ roomId }] : []),
                ],
            },
            select: { scheduledAt: true, estimatedDuration: true, roomId: true, requestingDoctorId: true, patientId: true },
        }),

    countExaminations: (appointmentId: string) => prisma.medicalExamination.count({ where: { appointmentId } }),

    delete: (id: string) => prisma.appointment.delete({ where: { id } }),

    update: (id: string, data: Prisma.AppointmentUncheckedUpdateInput) =>
        prisma.appointment.update({ where: { id }, data, include: appointmentInclude }),
}
