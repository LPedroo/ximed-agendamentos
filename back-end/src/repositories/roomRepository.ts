import { prisma } from "../lib/prisma.js"
import type { Prisma } from "../../generated/prisma/client.js"

export const roomRepository = {
    create: (data: Prisma.RoomCreateInput) => prisma.room.create({ data }),

    async findPaginated({
        search,
        roomType,
        status,
        skip,
        take,
    }: {
        search?: string | undefined
        roomType?: Prisma.RoomWhereInput["roomType"]
        status?: Prisma.RoomWhereInput["status"]
        skip: number
        take: number
    }) {
        const where: Prisma.RoomWhereInput = {
            ...(roomType && { roomType }),
            ...(status && { status }),
            ...(search && { name: { contains: search, mode: "insensitive" } }),
        }

        const [data, total] = await prisma.$transaction([
            prisma.room.findMany({ where, orderBy: { name: "asc" }, skip, take }),
            prisma.room.count({ where }),
        ])
        return { data, total }
    },

    findById: (id: string) => prisma.room.findUnique({ where: { id } }),

    hasAppointments: async (id: string) =>
        (await prisma.appointment.count({ where: { roomId: id } })) > 0,

    update: (id: string, data: Prisma.RoomUpdateInput) => prisma.room.update({ where: { id }, data }),

    delete: (id: string) => prisma.room.delete({ where: { id } }),
}
