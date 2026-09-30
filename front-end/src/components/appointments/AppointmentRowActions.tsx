"use client"

import { useState, useTransition } from "react"
import type { AppointmentResponse } from "@shared/schemas/appointmentSchema"
import { cancelAppointment, deleteAppointment } from "@/actions/appointments"
import { Button, ButtonLink } from "@/components/ui/Button"
import type { ActionResult } from "@/types/api"

export function AppointmentRowActions({ appointment }: { appointment: Pick<AppointmentResponse, "id" | "status"> }) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const isCancelled = appointment.status === "CANCELLED"

    const run = (confirmation: string, action: () => Promise<ActionResult<unknown>>) => {
        if (!window.confirm(confirmation)) return
        setError(null)
        startTransition(async () => {
            const result = await action()
            if (!result.ok) setError(result.message)
        })
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <div className="flex gap-1">
                {!isCancelled && (
                    <>
                        <ButtonLink href={`/appointments/${appointment.id}/edit`} variant="secondary" size="sm" arrow={false}>Editar</ButtonLink>
                        <Button
                            variant="secondary"
                            size="sm"
                            arrow={false}
                            disabled={isPending}
                            onClick={() => run("Cancelar este agendamento?", () => cancelAppointment(appointment.id))}
                        >
                            Cancelar
                        </Button>
                    </>
                )}
                <Button
                    variant="danger"
                    size="sm"
                    arrow={false}
                    disabled={isPending}
                    onClick={() => run("Excluir este agendamento? Essa ação não pode ser desfeita.", () => deleteAppointment(appointment.id))}
                >
                    Excluir
                </Button>
            </div>
            {error && <p role="alert" className="max-w-56 text-right text-[13px] text-error">{error}</p>}
        </div>
    )
}
