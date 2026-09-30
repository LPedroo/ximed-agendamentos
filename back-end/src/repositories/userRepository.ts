import { prisma } from "../lib/prisma.js"
import type { Prisma, UserRole } from "../../generated/prisma/client.js"

const publicSelect = {
    id: true,
    name: true,
    email: true,
    telephone: true,
    cpf: true,
    role: true,
    active: true,
    patient: { select: { id: true } },
    doctor: { select: { id: true, crm: true } },
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.UserSelect

export const userRepository = {
    create: (data: Prisma.UserCreateInput) =>
        prisma.user.create({ data, select: publicSelect }),

    async findPaginated({
        includeInactive,
        search,
        role,
        skip,
        take,
    }: {
        includeInactive: boolean
        search?: string | undefined
        role?: UserRole | undefined
        skip: number
        take: number
    }) {
        const where: Prisma.UserWhereInput = {
            ...(!includeInactive && { active: true }),
            ...(role && { role }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { cpf: { contains: search } },
                ],
            }),
        }

        const [data, total] = await prisma.$transaction([
            prisma.user.findMany({
                where,
                select: publicSelect,
                orderBy: { createdAt: "desc" },
                skip,
                take,
            }),
            prisma.user.count({ where }),
        ])
        return { data, total }
    },

    findAuthByEmail: (email: string) =>
        prisma.user.findUnique({
            where: { email },
            select: { id: true, password: true, role: true, active: true },
        }),

    findSessionById: (id: string) =>
        prisma.user.findUnique({ where: { id }, select: { id: true, role: true, active: true, patient: { select: { id: true } } },
        }),

    findById: (id: string) =>
        prisma.user.findUnique({ where: { id }, select: publicSelect }),

    findByEmailOrCpf: (email?: string, cpf?: string) =>
        prisma.user.findFirst({
            where: { OR: [...(email ? [{ email }] : []), ...(cpf ? [{ cpf }] : [])] },
            select: { id: true },
        }),

    findDoctorByCrm: (crm: string) =>
        prisma.doctor.findUnique({ where: { crm }, select: { userId: true } }),

    update: (id: string, data: Prisma.UserUpdateInput) =>
        prisma.user.update({ where: { id }, data, select: publicSelect }),
}
