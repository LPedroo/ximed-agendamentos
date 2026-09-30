"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { createAppointment, type AppointmentFormOptions } from "@/actions/appointments"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass, textareaClass } from "@/components/ui/Field"
import type { AppointmentPayload } from "@/types/appointments"
import { applyApiErrors, formatCpf, fromDateTimeLocalValue, REQUIRED_MESSAGE } from "@/utils"

type FormValues = {
    patientId: string
    requestingDoctorId: string
    roomId: string
    examTypeId: string
    scheduledAt: string
    estimatedDuration: string
    observations: string
}

type Props = { options: AppointmentFormOptions }

// Campos vazios são omitidos.
const buildPayload = (values: FormValues): AppointmentPayload => ({
    patientId: values.patientId,
    requestingDoctorId: values.requestingDoctorId,
    scheduledAt: fromDateTimeLocalValue(values.scheduledAt),
    roomId: values.roomId || undefined,
    examTypeId: values.examTypeId || undefined,
    estimatedDuration: values.estimatedDuration ? Number(values.estimatedDuration) : undefined,
    observations: values.observations.trim() || undefined,
})

export function AppointmentForm({ options }: Props) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            patientId: "",
            requestingDoctorId: "",
            roomId: "",
            examTypeId: "",
            scheduledAt: "",
            estimatedDuration: "",
            observations: "",
        },
    })

    const onSubmit = handleSubmit(async (values) => {
        const result = await createAppointment(buildPayload(values))

        if (!result.ok) return applyApiErrors(result, Object.keys(values), setError)

        router.push("/appointments")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-border bg-white p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
                <Field label="Paciente *" error={errors.patientId?.message}>
                    <select className={inputClass} {...register("patientId", { required: REQUIRED_MESSAGE })}>
                        <option value="">Selecione…</option>
                        {options.patients.map((user) => (
                            <option key={user.id} value={user.patient?.id}>{user.name} · {formatCpf(user.cpf)}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Médico solicitante *" error={errors.requestingDoctorId?.message}>
                    <select className={inputClass} {...register("requestingDoctorId", { required: REQUIRED_MESSAGE })}>
                        <option value="">Selecione…</option>
                        {options.doctors.map((user) => (
                            <option key={user.id} value={user.doctor?.id}>{user.name} · {user.doctor?.crm}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Data e hora *" error={errors.scheduledAt?.message}>
                    <input type="datetime-local" className={inputClass} {...register("scheduledAt", { required: REQUIRED_MESSAGE })} />
                </Field>

                <Field label="Duração estimada (min)" error={errors.estimatedDuration?.message}>
                    <input
                        type="number"
                        min={1}
                        max={480}
                        className={inputClass}
                        {...register("estimatedDuration", {
                            min: { value: 1, message: "Mínimo de 1 minuto." },
                            max: { value: 480, message: "Máximo de 480 minutos." },
                        })}
                    />
                </Field>

                <Field label="Tipo de exame" error={errors.examTypeId?.message}>
                    <select className={inputClass} {...register("examTypeId")}>
                        <option value="">Nenhum</option>
                        {options.examTypes.map((examType) => (
                            <option key={examType.id} value={examType.id}>{examType.name}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Sala" error={errors.roomId?.message}>
                    <select className={inputClass} {...register("roomId")}>
                        <option value="">Nenhuma</option>
                        {options.rooms.map((room) => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                        ))}
                    </select>
                </Field>

            </div>

            <Field label="Observações" error={errors.observations?.message}>
                <textarea rows={3} maxLength={1000} className={textareaClass} {...register("observations")} />
            </Field>

            {errors.root?.message && <ErrorMessage message={errors.root.message} />}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" arrow={false} disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Agendar"}</Button>
                <Button type="button" variant="secondary" arrow={false} onClick={() => router.push("/appointments")}>Voltar</Button>
            </div>
        </form>
    )
}
