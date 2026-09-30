import { prisma } from "../lib/prisma.js"
import type { Prisma } from "../../generated/prisma/client.js"
import { patientInclude, doctorInclude, userSummarySelect } from "./includes.js"

const examinationInclude = {
    examType: true,
    patient: patientInclude,
    doctor: doctorInclude,
    appointment: { select: { id: true, scheduledAt: true, status: true } },
    createdBy: userSummarySelect,
} satisfies Prisma.MedicalExaminationInclude


export const medicalExaminationRepository = {
    create: (data: Prisma.MedicalExaminationUncheckedCreateInput) =>
        prisma.medicalExamination.create({ data, include: examinationInclude }),

    // Cria o exame e, se estiver vinculado a uma visita confirmada, marca a visita como atendida.
    createAttendingAppointment: (data: Prisma.MedicalExaminationUncheckedCreateInput & { appointmentId: string }) =>
        prisma.$transaction(async (tx) => {
            await tx.appointment.updateMany({
                where: { id: data.appointmentId, status: "CONFIRMED" },
                data: { status: "ATTENDED" },
            })
            return tx.medicalExamination.create({ data, include: examinationInclude })
        }),

    updateAttendingAppointment: (
        id: string,
        data: Prisma.MedicalExaminationUncheckedUpdateInput,
        appointmentId: string,
    ) =>
        prisma.$transaction(async (tx) => {
            await tx.appointment.updateMany({
                where: { id: appointmentId, status: "CONFIRMED" },
                data: { status: "ATTENDED" },
            })
            return tx.medicalExamination.update({ where: { id }, data, include: examinationInclude })
        }),

    async findPaginated({
        search,
        examTypeId,
        patientId,
        doctorId,
        appointmentId,
        status,
        skip,
        take,
    }: {
        search?: string | undefined
        examTypeId?: string | undefined
        patientId?: string | undefined
        doctorId?: string | undefined
        appointmentId?: string | undefined
        status?: string | undefined
        skip: number
        take: number
    }) {
        const where: Prisma.MedicalExaminationWhereInput = {
            ...(examTypeId && { examTypeId }),
            ...(patientId && { patientId }),
            ...(doctorId && { doctorId }),
            ...(appointmentId && { appointmentId }),
            ...(status && { status }),
            ...(search && { examType: { name: { contains: search, mode: "insensitive" } } }),
        }

        const [data, total] = await prisma.$transaction([
            prisma.medicalExamination.findMany({
                where,
                include: examinationInclude,
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            prisma.medicalExamination.count({ where }),
        ])
        return { data, total }
    },

    findById: (id: string) => prisma.medicalExamination.findUnique({ where: { id }, include: examinationInclude }),

    findAppointment: (id: string) =>
        prisma.appointment.findUnique({ where: { id }, select: { patientId: true, requestingDoctorId: true, status: true } }),

    update: (id: string, data: Prisma.MedicalExaminationUncheckedUpdateInput) =>
        prisma.medicalExamination.update({ where: { id }, data, include: examinationInclude }),

    delete: (id: string) => prisma.medicalExamination.delete({ where: { id } }),
}
