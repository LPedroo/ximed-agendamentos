import type { CreateRoomInput, ListRoomsQuery, UpdateRoomInput } from "../../../shared/schemas/roomSchema.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "../middlewares/errors/HttpError.js"
import { omitUndefined } from "../lib/omitUndefined.js"
import { roomRepository } from "../repositories/roomRepository.js"

const roomNotFound = () =>
    new HttpError(404, HTTP_ERROR_MESSAGE.ROOM_NOT_FOUND, HttpErrorType.ROOM_NOT_FOUND)

const roomInUse = () =>
    new HttpError(409, HTTP_ERROR_MESSAGE.ROOM_IN_USE, HttpErrorType.ROOM_IN_USE)

export const roomService = {
    create(input: CreateRoomInput) {
        return roomRepository.create(omitUndefined(input))
    },

    async list({ page, limit, ...filters }: ListRoomsQuery) {
        const { data, total } = await roomRepository.findPaginated({
            ...filters,
            skip: (page - 1) * limit,
            take: limit,
        })
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
    },

    async getById(id: string) {
        const room = await roomRepository.findById(id)
        if (!room) throw roomNotFound()
        return room
    },

    async update(id: string, input: UpdateRoomInput) {
        await this.getById(id)
        return roomRepository.update(id, omitUndefined(input))
    },

    async delete(id: string) {
        await this.getById(id)
        if (await roomRepository.hasAppointments(id)) throw roomInUse()
        await roomRepository.delete(id)
    },
}
