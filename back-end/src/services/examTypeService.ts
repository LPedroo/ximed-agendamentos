import type {
    CreateExamTypeInput,
    ListExamTypesQuery,
    UpdateExamTypeInput,
} from "../../../shared/schemas/examTypeSchema.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "../middlewares/errors/HttpError.js"
import { omitUndefined } from "../lib/omitUndefined.js"
import { examTypeRepository } from "../repositories/examTypeRepository.js"

const error = (status: number, type: HttpErrorType) =>
    new HttpError(status, HTTP_ERROR_MESSAGE[type], type)

export const examTypeService = {
    async create(input: CreateExamTypeInput) {
        if (await examTypeRepository.findByName(input.name)) throw error(409, HttpErrorType.EXAM_TYPE_EXISTS)
        return examTypeRepository.create(omitUndefined(input))
    },

    async list({ page, limit, ...filters }: ListExamTypesQuery) {
        const { data, total } = await examTypeRepository.findPaginated({
            ...filters,
            skip: (page - 1) * limit,
            take: limit,
        })
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
    },

    async getById(id: string) {
        const examType = await examTypeRepository.findById(id)
        if (!examType) throw error(404, HttpErrorType.EXAM_TYPE_NOT_FOUND)
        return examType
    },

    async update(id: string, input: UpdateExamTypeInput) {
        await this.getById(id)

        if (input.name) {
            const conflict = await examTypeRepository.findByName(input.name)
            if (conflict && conflict.id !== id) throw error(409, HttpErrorType.EXAM_TYPE_EXISTS)
        }

        return examTypeRepository.update(id, omitUndefined(input))
    },

    async disable(id: string) {
        const examType = await this.getById(id)
        if (!examType.active) throw error(409, HttpErrorType.EXAM_TYPE_DISABLED)
        return examTypeRepository.update(id, { active: false })
    },

    async enable(id: string) {
        const examType = await this.getById(id)
        if (examType.active) throw error(409, HttpErrorType.EXAM_TYPE_ALREADY_ACTIVE)
        return examTypeRepository.update(id, { active: true })
    },
}
