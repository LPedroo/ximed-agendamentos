import type { AppointmentResponse } from "@shared/schemas/appointmentSchema"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { formatDateTime } from "@/utils"
import { AppointmentRowActions } from "./AppointmentRowActions"

type Props = { appointments: AppointmentResponse[]; canWrite: boolean }

export function AppointmentsTable({ appointments, canWrite }: Props) {
    if (appointments.length === 0) {
        return <p className="rounded-md border border-border bg-white p-8 text-center text-text-muted">Nenhum agendamento encontrado.</p>
    }

    return (
        <div className="overflow-x-auto rounded-md border border-border bg-white">
            <table className="w-full text-left text-sm">
                <thead className="bg-surface text-sm font-semibold">
                    <tr>
                        <th className="px-4 py-3">Data e hora</th>
                        <th className="px-4 py-3">Paciente</th>
                        <th className="px-4 py-3">Médico</th>
                        <th className="px-4 py-3">Exame</th>
                        <th className="px-4 py-3">Sala</th>
                        <th className="px-4 py-3">Status</th>
                        {canWrite && <th className="px-4 py-3 text-right">Ações</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {appointments.map((appointment) => (
                        <tr key={appointment.id} className="transition-colors hover:bg-surface-2">
                            <td className="whitespace-nowrap px-4 py-3">{formatDateTime(appointment.scheduledAt)}</td>
                            <td className="px-4 py-3">{appointment.patient.user.name}</td>
                            <td className="px-4 py-3">{appointment.requestingDoctor.user.name}</td>
                            <td className="px-4 py-3">{appointment.examType?.name ?? "—"}</td>
                            <td className="px-4 py-3">{appointment.room?.name ?? "—"}</td>
                            <td className="px-4 py-3"><StatusBadge status={appointment.status} /></td>
                            {canWrite && (
                                <td className="px-4 py-3"><AppointmentRowActions appointment={appointment} /></td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
