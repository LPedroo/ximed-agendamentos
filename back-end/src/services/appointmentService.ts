import type {
    CreateAppointmentInput,
    ListAppointmentsQuery,
    UpdateAppointmentInput,
} from "../../../shared/schemas/appointmentSchema.js"
import { HTTP_ERROR_MESSAGE, HttpErrorType } from "../../../shared/schemas/httpErrorTypes.js"
import { HttpError } from "../middlewares/errors/HttpError.js"
import { omitUndefined } from "../lib/omitUndefined.js"
import { appointmentRepository } from "../repositories/appointmentRepository.js"
import { profileRepository } from "../repositories/profileRepository.js"

const DEFAULT_DURATION_MINUTES = 30
const MAX_DURATION_MINUTES = 480
const MINUTE = 60_000

const error = (status: number, type: HttpErrorType) =>
    new HttpError(status, HTTP_ERROR_MESSAGE[type], type)

type Slot = {
    patientId: string
    requestingDoctorId: string
    roomId?: string | null | undefined
    examTypeId?: string | null | undefined
    scheduledAt: Date
    estimatedDuration?: number | null | undefined
}

const endOf = (start: Date, duration?: number | null) =>
    new Date(start.getTime() + (duration ?? DEFAULT_DURATION_MINUTES) * MINUTE)

const assertSlot = async (slot: Slot, excludeId?: string) => {
    const [patientUserId, doctorUserId] = await Promise.all([
        profileRepository.findPatientUserId(slot.patientId),
        profileRepository.findDoctorUserId(slot.requestingDoctorId),
    ])
    if (!patientUserId) throw error(404, HttpErrorType.PATIENT_NOT_FOUND)
    if (!doctorUserId) throw error(404, HttpErrorType.DOCTOR_NOT_FOUND)
    if (patientUserId === doctorUserId) throw error(400, HttpErrorType.SELF_APPOINTMENT_NOT_ALLOWED)

    if (slot.examTypeId) {
        const examType = await appointmentRepository.findExamType(slot.examTypeId)
        if (!examType) throw error(404, HttpErrorType.EXAM_TYPE_NOT_FOUND)
        if (!examType.active) throw error(409, HttpErrorType.EXAM_TYPE_DISABLED)
    }

    if (slot.roomId) {
        const room = await appointmentRepository.findRoom(slot.roomId)
        if (!room) throw error(404, HttpErrorType.ROOM_NOT_FOUND)
        if (room.status !== "AVAILABLE") throw error(409, HttpErrorType.ROOM_UNAVAILABLE)
    }

    const start = slot.scheduledAt
    const end = endOf(start, slot.estimatedDuration)
    const candidates = await appointmentRepository.findActiveStartingBetween({
        from: new Date(start.getTime() - MAX_DURATION_MINUTES * MINUTE),
        to: end,
        roomId: slot.roomId,
        doctorId: slot.requestingDoctorId,
        patientId: slot.patientId,
        excludeId,
    })
    const overlapping = candidates.filter((a) => endOf(a.scheduledAt, a.estimatedDuration) > start)

    if (slot.roomId && overlapping.some((a) => a.roomId === slot.roomId)) throw error(409, HttpErrorType.ROOM_BUSY)
    if (overlapping.some((a) => a.requestingDoctorId === slot.requestingDoctorId)) throw error(409, HttpErrorType.DOCTOR_BUSY)
    if (overlapping.some((a) => a.patientId === slot.patientId)) throw error(409, HttpErrorType.PATIENT_BUSY)
}

const assertFuture = (date: Date) => {
    if (date.getTime() <= Date.now()) throw error(400, HttpErrorType.APPOINTMENT_IN_PAST)
}

export const appointmentService = {
    async create(input: CreateAppointmentInput, createdById: string) {
        assertFuture(input.scheduledAt)
        await assertSlot(input)
        return appointmentRepository.create({ ...omitUndefined(input), createdById })
    },

    async list({ page, limit, ...filters }: ListAppointmentsQuery) {
        const { data, total } = await appointmentRepository.findPaginated({
            ...filters,
            skip: (page - 1) * limit,
            take: limit,
        })
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
    },

    async getById(id: string, onlyPatientId?: string) {
        const appointment = await appointmentRepository.findById(id)
        if (!appointment || (onlyPatientId !== undefined && appointment.patientId !== onlyPatientId)) throw error(404, HttpErrorType.APPOINTMENT_NOT_FOUND)
        return appointment
    },

    async update(id: string, input: UpdateAppointmentInput) {
        const current = await this.getById(id)
        if (current.status === "CANCELLED") throw error(409, HttpErrorType.APPOINTMENT_CANCELLED)

        if (input.scheduledAt) assertFuture(input.scheduledAt)

        const next = { ...current, ...omitUndefined(input) }
        const changesSlot = ["patientId", "requestingDoctorId", "roomId", "examTypeId", "scheduledAt", "estimatedDuration"].some(
            (key) => key in input,
        )
        if (changesSlot && ["SCHEDULED", "CONFIRMED"].includes(next.status)) await assertSlot(next, id)

        return appointmentRepository.update(id, omitUndefined(input))
    },

    async cancel(id: string) {
        const appointment = await this.getById(id)
        if (appointment.status === "CANCELLED") throw error(409, HttpErrorType.APPOINTMENT_CANCELLED)
        return appointmentRepository.update(id, { status: "CANCELLED" })
    },
}
