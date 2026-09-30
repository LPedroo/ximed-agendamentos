import { prisma } from "../lib/prisma.js"
import type { Prisma } from "../../generated/prisma/client.js"

export const medicalExaminationRepository = {
    create: (data: Prisma.MedicalExaminationUncheckedCreateInput) =>
        prisma.medicalExamination.create({ data }),

    async findPaginated({
        search,
        patientId,
        doctorId,
        status,
        skip,
        take,
    }: {
        search?: string | undefined
        patientId?: string | undefined
        doctorId?: string | undefined
        status?: string | undefined
        skip: number
        take: number
    }) {
        const where: Prisma.MedicalExaminationWhereInput = {
            ...(patientId && { patientId }),
            ...(doctorId && { doctorId }),
            ...(status && { status }),
            ...(search && { name: { contains: search, mode: "insensitive" } }),
        }

        const [data, total] = await prisma.$transaction([
            prisma.medicalExamination.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            prisma.medicalExamination.count({ where }),
        ])
        return { data, total }
    },

    findById: (id: string) => prisma.medicalExamination.findUnique({ where: { id } }),

    findPatientUserId: async (id: string) =>
        (await prisma.patient.findUnique({ where: { id }, select: { userId: true } }))?.userId ?? null,

    findDoctorUserId: async (id: string) =>
        (await prisma.doctor.findUnique({ where: { id }, select: { userId: true } }))?.userId ?? null,

    update: (id: string, data: Prisma.MedicalExaminationUncheckedUpdateInput) =>
        prisma.medicalExamination.update({ where: { id }, data }),

    delete: (id: string) => prisma.medicalExamination.delete({ where: { id } }),
}
