// Corpo aceito pela API para criar/alterar agendamentos. Na criação, campos vazios são omitidos;
// na alteração, `null` limpa o campo.
export type AppointmentPayload = {
    patientId: string
    requestingDoctorId: string
    roomId?: string | null
    examTypeId?: string | null
    scheduledAt: string
    estimatedDuration?: number | null
    observations?: string | null
    status?: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "ATTENDED" | "NO_SHOW"
}
