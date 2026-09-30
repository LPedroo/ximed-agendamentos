import { prisma } from "../lib/prisma.js"

export const profileRepository = {
    findPatientUserId: async (id: string) =>
        (await prisma.patient.findUnique({ where: { id }, select: { userId: true } }))?.userId ?? null,

    findDoctorUserId: async (id: string) =>
        (await prisma.doctor.findUnique({ where: { id }, select: { userId: true } }))?.userId ?? null,
}
