import type {
    CreateMedicalExaminationInput,
    ListMedicalExaminationsQuery,
    UpdateMedicalExaminationInput,
} from "../../../shared/schemas/medicalExaminationSchema.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "../middlewares/errors/HttpError.js"
import { omitUndefined } from "../lib/omitUndefined.js"
import { medicalExaminationRepository } from "../repositories/medicalExaminationRepository.js"

const examNotFound = () =>
    new HttpError(404, HTTP_ERROR_MESSAGE.EXAM_NOT_FOUND, HttpErrorType.EXAM_NOT_FOUND)

const patientNotFound = () =>
    new HttpError(404, HTTP_ERROR_MESSAGE.PATIENT_NOT_FOUND, HttpErrorType.PATIENT_NOT_FOUND)

const doctorNotFound = () =>
    new HttpError(404, HTTP_ERROR_MESSAGE.DOCTOR_NOT_FOUND, HttpErrorType.DOCTOR_NOT_FOUND)

const selfExamination = () =>
    new HttpError(
        400,
        HTTP_ERROR_MESSAGE.SELF_EXAMINATION_NOT_ALLOWED,
        HttpErrorType.SELF_EXAMINATION_NOT_ALLOWED,
    )

const assertRelations = async (patientId: string, doctorId: string) => {
    const [patientUserId, doctorUserId] = await Promise.all([
        medicalExaminationRepository.findPatientUserId(patientId),
        medicalExaminationRepository.findDoctorUserId(doctorId),
    ])
    if (!patientUserId) throw patientNotFound()
    if (!doctorUserId) throw doctorNotFound()
    if (patientUserId === doctorUserId) throw selfExamination()
}

export const medicalExaminationService = {
    async create(input: CreateMedicalExaminationInput) {
        await assertRelations(input.patientId, input.doctorId)
        return medicalExaminationRepository.create(omitUndefined(input))
    },

    async list({ page, limit, ...filters }: ListMedicalExaminationsQuery) {
        const { data, total } = await medicalExaminationRepository.findPaginated({
            ...filters,
            skip: (page - 1) * limit,
            take: limit,
        })
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
    },

    async getById(id: string) {
        const exam = await medicalExaminationRepository.findById(id)
        if (!exam) throw examNotFound()
        return exam
    },

    async update(id: string, input: UpdateMedicalExaminationInput) {
        const current = await this.getById(id)
        if (input.patientId || input.doctorId) {
            await assertRelations(input.patientId ?? current.patientId, input.doctorId ?? current.doctorId)
        }
        return medicalExaminationRepository.update(id, omitUndefined(input))
    },

    async delete(id: string) {
        await this.getById(id)
        await medicalExaminationRepository.delete(id)
    },
}
