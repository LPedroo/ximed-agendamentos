// Corpo aceito pela API para criar agendamentos (campos vazios são omitidos).
export type AppointmentPayload = {
    patientId: string
    requestingDoctorId: string
    roomId?: string | null
    examTypeId?: string | null
    scheduledAt: string
    estimatedDuration?: number | null
    observations?: string | null
}

// Reagendamento: só a data muda e o agendamento volta a ficar confirmado.
export type AppointmentReschedulePayload = { scheduledAt: string; status: "CONFIRMED" }
