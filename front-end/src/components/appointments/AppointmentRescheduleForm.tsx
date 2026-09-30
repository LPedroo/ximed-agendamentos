"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type { AppointmentResponse } from "@shared/schemas/appointmentSchema"
import { updateAppointment } from "@/actions/appointments"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass } from "@/components/ui/Field"
import { applyApiErrors, fromDateTimeLocalValue, REQUIRED_MESSAGE, toDateTimeLocalValue } from "@/utils"

type FormValues = { scheduledAt: string }

// Edição restrita à data: salvar também confirma o agendamento.
export function AppointmentRescheduleForm({ appointment }: { appointment: AppointmentResponse }) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ defaultValues: { scheduledAt: toDateTimeLocalValue(appointment.scheduledAt) } })

    const onSubmit = handleSubmit(async (values) => {
        const result = await updateAppointment(appointment.id, { scheduledAt: fromDateTimeLocalValue(values.scheduledAt), status: "CONFIRMED" })

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

            {errors.root?.message && <ErrorMessage message={errors.root.message} />}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" arrow={false} disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar e confirmar"}</Button>
                <Button type="button" variant="secondary" arrow={false} onClick={() => router.push("/appointments")}>Voltar</Button>
            </div>
        </form>
    )
}
