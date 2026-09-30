"use client"

import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import type { MedicalExaminationResponse } from "@shared/schemas/medicalExaminationSchema"
import { createMedicalExamination, updateMedicalExamination, type ExaminationFormOptions } from "@/actions/medical-examinations"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass, textareaClass } from "@/components/ui/Field"
import { APPOINTMENT_STATUS_LABEL } from "@/constants/labels"
import type { MedicalExaminationPayload } from "@/types/medicalExaminations"
import { applyApiErrors, formatCpf, formatDateTime, fromDateTimeLocalValue, REQUIRED_MESSAGE, toDateTimeLocalValue } from "@/utils"

type FormValues = {
    examTypeId: string
    patientId: string
    doctorId: string
    appointmentId: string
    datePerformed: string
    dateResult: string
    status: string
    result: string
    report: string
}

type Props = { options: ExaminationFormOptions; examination?: MedicalExaminationResponse }

const STATUS_SUGGESTIONS = ["Pendente", "Em andamento", "Realizado", "Finalizado"]

// Criação: campos vazios são omitidos. Alteração: `null` limpa o campo.
const buildPayload = (values: FormValues, isEdit: boolean): MedicalExaminationPayload => {
    const optional = <T,>(value: T | undefined) => (isEdit ? (value ?? null) : (value ?? undefined))

    return {
        examTypeId: values.examTypeId,
        patientId: values.patientId,
        doctorId: values.doctorId,
        appointmentId: optional(values.appointmentId || undefined),
        datePerformed: optional(values.datePerformed ? fromDateTimeLocalValue(values.datePerformed) : undefined),
        dateResult: optional(values.dateResult ? fromDateTimeLocalValue(values.dateResult) : undefined),
        status: optional(values.status.trim() || undefined),
        result: optional(values.result.trim() || undefined),
        report: optional(values.report.trim() || undefined),
    } as MedicalExaminationPayload
}

export function MedicalExaminationForm({ options, examination }: Props) {
    const router = useRouter()
    const isEdit = !!examination

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            examTypeId: examination?.examTypeId ?? "",
            patientId: examination?.patientId ?? "",
            doctorId: examination?.doctorId ?? "",
            appointmentId: examination?.appointmentId ?? "",
            datePerformed: examination?.datePerformed ? toDateTimeLocalValue(examination.datePerformed) : "",
            dateResult: examination?.dateResult ? toDateTimeLocalValue(examination.dateResult) : "",
            status: examination?.status ?? "",
            result: examination?.result ?? "",
            report: examination?.report ?? "",
        },
    })

    const patientId = useWatch({ control, name: "patientId" })
    const doctorId = useWatch({ control, name: "doctorId" })

    // Mantém o tipo de exame atual no select mesmo que já esteja desativado.
    const examTypes =
        examination && !options.examTypes.some((e) => e.id === examination.examTypeId) ? [examination.examType, ...options.examTypes] : options.examTypes

    // A API exige que o agendamento seja do mesmo paciente e médico do exame.
    const appointments = options.appointments.filter((a) => a.patientId === patientId && a.requestingDoctorId === doctorId)

    const onSubmit = handleSubmit(async (values) => {
        const payload = buildPayload(values, isEdit)
        const result = examination ? await updateMedicalExamination(examination.id, payload) : await createMedicalExamination(payload)

        if (!result.ok) return applyApiErrors(result, Object.keys(values), setError)

        router.push("/medical-examinations")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-border bg-white p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
                <Field label="Tipo de exame *" error={errors.examTypeId?.message}>
                    <select className={inputClass} {...register("examTypeId", { required: REQUIRED_MESSAGE })}>
                        <option value="">Selecione…</option>
                        {examTypes.map((examType) => (
                            <option key={examType.id} value={examType.id}>{examType.name}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Status" error={errors.status?.message}>
                    <input list="exam-status-options" maxLength={50} className={inputClass} {...register("status")} />
                    <datalist id="exam-status-options">
                        {STATUS_SUGGESTIONS.map((status) => (
                            <option key={status} value={status} />
                        ))}
                    </datalist>
                </Field>

                <Field label="Paciente *" error={errors.patientId?.message}>
                    <select className={inputClass} {...register("patientId", { required: REQUIRED_MESSAGE })}>
                        <option value="">Selecione…</option>
                        {options.patients.map((user) => (
                            <option key={user.id} value={user.patient?.id}>{user.name} · {formatCpf(user.cpf)}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Médico *" error={errors.doctorId?.message}>
                    <select className={inputClass} {...register("doctorId", { required: REQUIRED_MESSAGE })}>
                        <option value="">Selecione…</option>
                        {options.doctors.map((user) => (
                            <option key={user.id} value={user.doctor?.id}>{user.name} · {user.doctor?.crm}</option>
                        ))}
                    </select>
                </Field>

                <div className="md:col-span-2">
                    <Field label="Agendamento vinculado" error={errors.appointmentId?.message}>
                        <select className={inputClass} disabled={!patientId || !doctorId} {...register("appointmentId")}>
                            <option value="">{patientId && doctorId ? "Nenhum" : "Selecione paciente e médico primeiro"}</option>
                            {appointments.map((appointment) => (
                                <option key={appointment.id} value={appointment.id}>
                                    {formatDateTime(appointment.scheduledAt)} · {appointment.examType?.name ?? "Sem tipo"} · {APPOINTMENT_STATUS_LABEL[appointment.status]}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <p className="mt-1.5 text-[13px] text-text-muted">Só agendamentos confirmados ou atendidos. Ao vincular um agendamento confirmado, ele passa a ser atendido.</p>
                </div>

                <Field label="Realizado em" error={errors.datePerformed?.message}>
                    <input type="datetime-local" className={inputClass} {...register("datePerformed")} />
                </Field>

                <Field label="Resultado em" error={errors.dateResult?.message}>
                    <input type="datetime-local" className={inputClass} {...register("dateResult")} />
                </Field>
            </div>

            <Field label="Resultado" error={errors.result?.message}>
                <textarea rows={3} maxLength={5000} className={textareaClass} {...register("result")} />
            </Field>

            <Field label="Laudo" error={errors.report?.message}>
                <textarea rows={4} maxLength={5000} className={textareaClass} {...register("report")} />
            </Field>

            {errors.root?.message && <ErrorMessage message={errors.root.message} />}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" arrow={false} disabled={isSubmitting}>{isSubmitting ? "Salvando..." : isEdit ? "Salvar alterações" : "Registrar exame"}</Button>
                <Button type="button" variant="secondary" arrow={false} onClick={() => router.push("/medical-examinations")}>Voltar</Button>
            </div>
        </form>
    )
}
