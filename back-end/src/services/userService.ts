import bcrypt from "bcryptjs"
import type { CreateUserInput, ListUsersQuery, UpdateUserInput } from "../../../shared/schemas/userSchema.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "../middlewares/errors/HttpError.js"
import { omitUndefined } from "../lib/omitUndefined.js"
import { userRepository } from "../repositories/userRepository.js"

const SALT_ROUNDS = 10

const userExists = () =>
    new HttpError(409, HTTP_ERROR_MESSAGE.USER_EXISTS, HttpErrorType.USER_EXISTS)

const userNotFound = () =>
    new HttpError(404, HTTP_ERROR_MESSAGE.USER_NOT_FOUND, HttpErrorType.USER_NOT_FOUND)

const userDisabled = () =>
    new HttpError(409, HTTP_ERROR_MESSAGE.USER_DISABLED, HttpErrorType.USER_DISABLED)

export const userService = {
    async create({ password, ...input }: CreateUserInput) {
        if (await userRepository.findByEmailOrCpf(input.email, input.cpf)) throw userExists()

        return userRepository.create({
            ...omitUndefined(input),
            password: await bcrypt.hash(password, SALT_ROUNDS),
        })
    },

    async list({ page, limit, search, includeInactive }: ListUsersQuery) {
        const { data, total } = await userRepository.findPaginated({
            includeInactive,
            search,
            skip: (page - 1) * limit,
            take: limit,
        })
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
    },

    async getById(id: string) {
        const user = await userRepository.findById(id)
        if (!user) throw userNotFound()
        return user
    },

    async update(id: string, { password, ...input }: UpdateUserInput) {
        await this.getById(id)

        const conflict = await userRepository.findByEmailOrCpf(input.email, input.cpf)
        if (conflict && conflict.id !== id) throw userExists()

        return userRepository.update(id, {
            ...omitUndefined(input),
            ...(password && { password: await bcrypt.hash(password, SALT_ROUNDS) }),
        })
    },

    async disable(id: string) {
        const user = await this.getById(id)
        if (!user.active) throw userDisabled()
        return userRepository.update(id, { active: false })
    },

    async enable(id: string) {
        const user = await this.getById(id)
        if (user.active) {
            throw new HttpError(409, "Este usuário já está ativo.", "USER_ALREADY_ACTIVE")
        }
        return userRepository.update(id, { active: true })
    },
}
