import type {
    CreateMedicalExaminationInput,
    ListMedicalExaminationsQuery,
    UpdateMedicalExaminationInput,
} from "../../../shared/schemas/medicalExaminationSchema.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "../middlewares/errors/HttpError.js"
import { omitUndefined } from "../lib/omitUndefined.js"
import { examTypeRepository } from "../repositories/examTypeRepository.js"
import { profileRepository } from "../repositories/profileRepository.js"
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

const assertExamType = async (examTypeId: string) => {
    const examType = await examTypeRepository.findById(examTypeId)
    if (!examType) {
        throw new HttpError(404, HTTP_ERROR_MESSAGE.EXAM_TYPE_NOT_FOUND, HttpErrorType.EXAM_TYPE_NOT_FOUND)
    }
    if (!examType.active) {
        throw new HttpError(409, HTTP_ERROR_MESSAGE.EXAM_TYPE_DISABLED, HttpErrorType.EXAM_TYPE_DISABLED)
    }
}

const assertRelations = async (patientId: string, doctorId: string) => {
    const [patientUserId, doctorUserId] = await Promise.all([
        profileRepository.findPatientUserId(patientId),
        profileRepository.findDoctorUserId(doctorId),
    ])
    if (!patientUserId) throw patientNotFound()
    if (!doctorUserId) throw doctorNotFound()
    if (patientUserId === doctorUserId) throw selfExamination()
}

const assertAppointment = async (
    appointmentId: string,
    patientId: string,
    doctorId: string,
    { checkStatus }: { checkStatus: boolean },
) => {
    const appointment = await medicalExaminationRepository.findAppointment(appointmentId)
    if (!appointment) {
        throw new HttpError(404, HTTP_ERROR_MESSAGE.APPOINTMENT_NOT_FOUND, HttpErrorType.APPOINTMENT_NOT_FOUND)
    }
    if (appointment.patientId !== patientId || appointment.requestingDoctorId !== doctorId) {
        throw new HttpError(400, HTTP_ERROR_MESSAGE.APPOINTMENT_MISMATCH, HttpErrorType.APPOINTMENT_MISMATCH)
    }
    if (checkStatus && appointment.status !== "CONFIRMED" && appointment.status !== "ATTENDED") {
        throw new HttpError(
            409,
            HTTP_ERROR_MESSAGE.APPOINTMENT_NOT_ATTENDABLE,
            HttpErrorType.APPOINTMENT_NOT_ATTENDABLE,
        )
    }
}

export const medicalExaminationService = {
    async create(input: CreateMedicalExaminationInput) {
        await assertExamType(input.examTypeId)
        await assertRelations(input.patientId, input.doctorId)
        const data = omitUndefined(input)
        if (!input.appointmentId) return medicalExaminationRepository.create(data)

        await assertAppointment(input.appointmentId, input.patientId, input.doctorId, { checkStatus: true })
        return medicalExaminationRepository.createAttendingAppointment({
            ...data,
            appointmentId: input.appointmentId,
        })
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
        if (input.examTypeId) await assertExamType(input.examTypeId)

        const patientId = input.patientId ?? current.patientId
        const doctorId = input.doctorId ?? current.doctorId
        if (input.patientId || input.doctorId) await assertRelations(patientId, doctorId)

        const appointmentId = input.appointmentId === undefined ? current.appointmentId : input.appointmentId
        if (appointmentId && (input.appointmentId || input.patientId || input.doctorId)) {
            await assertAppointment(appointmentId, patientId, doctorId, { checkStatus: !!input.appointmentId })
        }

        const data = omitUndefined(input)
        return input.appointmentId
            ? medicalExaminationRepository.updateAttendingAppointment(id, data, input.appointmentId)
            : medicalExaminationRepository.update(id, data)
    },

    async delete(id: string) {
        await this.getById(id)
        await medicalExaminationRepository.delete(id)
    },
}
