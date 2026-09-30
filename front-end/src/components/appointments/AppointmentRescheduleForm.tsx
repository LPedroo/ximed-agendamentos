"use client"

import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import type { AppointmentResponse, AppointmentStatus } from "@shared/schemas/appointmentSchema"
import { updateAppointment } from "@/actions/appointments"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass } from "@/components/ui/Field"
import { OptionPicker } from "@/components/ui/OptionPicker"
import { APPOINTMENT_STATUS_LABEL } from "@/constants/labels"
import { applyApiErrors, fromDateTimeLocalValue, REQUIRED_MESSAGE, toDateTimeLocalValue } from "@/utils"

type FormValues = { scheduledAt: string; status: AppointmentStatus }

// Cancelar tem ação própria na listagem.
const STATUS_OPTIONS = (["SCHEDULED", "CONFIRMED", "ATTENDED", "NO_SHOW"] as const).map((value) => ({ value, label: APPOINTMENT_STATUS_LABEL[value] }))

// Edição de data e status. Um agendamento "Agendado" vem pré-selecionado como confirmado ao reagendar.
export function AppointmentRescheduleForm({ appointment }: { appointment: AppointmentResponse }) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ defaultValues: {
            scheduledAt: toDateTimeLocalValue(appointment.scheduledAt),
            status: appointment.status === "SCHEDULED" ? "CONFIRMED" : appointment.status,
        },
    })

    const onSubmit = handleSubmit(async (values) => {
        const result = await updateAppointment(appointment.id, { scheduledAt: fromDateTimeLocalValue(values.scheduledAt), status: values.status })

        if (!result.ok) return applyApiErrors(result, Object.keys(values), setError)

        router.push("/appointments")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-xl flex-col gap-6 rounded-xl border border-border bg-white p-6 md:p-8">
            <p className="text-sm text-text-muted">
                {appointment.patient.user.name} · {appointment.requestingDoctor.user.name}
            </p>

            <Field label="Data e hora *" error={errors.scheduledAt?.message}>
                <input type="datetime-local" className={inputClass} {...register("scheduledAt", { required: REQUIRED_MESSAGE })} />
            </Field>

            <Controller
                control={control}
                name="status"
                render={({ field }) => (
                    <OptionPicker label="Status" options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} error={errors.status?.message} />
                )}
            />

            {errors.root?.message && <ErrorMessage message={errors.root.message} />}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" arrow={false} disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar alterações"}</Button>
                <Button type="button" variant="secondary" arrow={false} onClick={() => router.push("/appointments")}>Voltar</Button>
            </div>
        </form>
    )
}
