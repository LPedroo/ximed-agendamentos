// Corpo aceito pela API para criar/alterar exames. Na criação, campos vazios são omitidos;
// na alteração, `null` limpa o campo.
export type MedicalExaminationPayload = {
    examTypeId: string
    patientId: string
    doctorId: string
    appointmentId?: string | null
    datePerformed?: string | null
    dateResult?: string | null
    status?: string | null
    result?: string | null
    report?: string | null
}
