import { prisma } from "../lib/prisma.js"
import type { Prisma } from "../../generated/prisma/client.js"

export const examTypeRepository = {
    create: (data: Prisma.ExamTypeCreateInput) => prisma.examType.create({ data }),

    async findPaginated({
        includeInactive,
        search,
        category,
        skip,
        take,
    }: {
        includeInactive: boolean
        search?: string | undefined
        category?: Prisma.ExamTypeWhereInput["category"]
        skip: number
        take: number
    }) {
        const where: Prisma.ExamTypeWhereInput = {
            ...(!includeInactive && { active: true }),
            ...(category && { category }),
            ...(search && { name: { contains: search, mode: "insensitive" } }),
        }

        const [data, total] = await prisma.$transaction([
            prisma.examType.findMany({ where, orderBy: [{ category: "asc" }, { name: "asc" }], skip, take }),
            prisma.examType.count({ where }),
        ])
        return { data, total }
    },

    findById: (id: string) => prisma.examType.findUnique({ where: { id } }),

    findByName: (name: string) =>
        prisma.examType.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
            select: { id: true },
        }),

    update: (id: string, data: Prisma.ExamTypeUpdateInput) =>
        prisma.examType.update({ where: { id }, data }),
}
