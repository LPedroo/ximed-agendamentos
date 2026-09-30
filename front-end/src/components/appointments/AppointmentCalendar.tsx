import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { AppointmentResponse } from "@shared/schemas/appointmentSchema"
import { ButtonLink } from "@/components/ui/Button"
import { STATUS_STYLE } from "@/components/ui/StatusBadge"
import { APPOINTMENT_STATUS_LABEL } from "@/constants/labels"
import { buildMonthGrid, currentMonth, formatMonthTitle, formatTime, shiftMonth, toDateKey, withQuery, type ListParams } from "@/utils"

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MAX_VISIBLE = 3

type Props = {
    month: string
    appointments: AppointmentResponse[]
    // Parâmetros da URL preservados ao navegar entre meses (filtros e página da tabela).
    params: ListParams
    canWrite: boolean
}

// Visão mensal (somente servidor): a navegação é feita por links com ?month=YYYY-MM.
export function AppointmentCalendar({ month, appointments, params, canWrite }: Props) {
    const days = buildMonthGrid(month)
    const today = toDateKey(new Date().toISOString())
    const monthHref = (target: string) => `${withQuery("/appointments", { ...params, month: target })}#calendario`

    const byDay = new Map<string, AppointmentResponse[]>()
    for (const appointment of [...appointments].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))) {
        const key = toDateKey(appointment.scheduledAt)
        byDay.set(key, [...(byDay.get(key) ?? []), appointment])
    }

    return (
        <section id="calendario" aria-label="Calendário de agendamentos" className="mt-12 scroll-mt-28">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[21px] leading-[1.3] font-semibold text-primary">{formatMonthTitle(month)}</h2>
                <div className="flex items-center gap-2">
                    <ButtonLink href={monthHref(shiftMonth(month, -1))} variant="secondary" size="sm" arrow={false} aria-label="Mês anterior">
                        <ChevronLeft className="size-4" strokeWidth={1.75} />
                    </ButtonLink>
                    <ButtonLink href={monthHref(currentMonth())} variant="secondary" size="sm" arrow={false}>Hoje</ButtonLink>
                    <ButtonLink href={monthHref(shiftMonth(month, 1))} variant="secondary" size="sm" arrow={false} aria-label="Próximo mês">
                        <ChevronRight className="size-4" strokeWidth={1.75} />
                    </ButtonLink>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border border-border bg-white">
                <div className="grid grid-cols-7 bg-surface text-center text-sm font-semibold">
                    {WEEKDAYS.map((weekday) => (
                        <div key={weekday} className="px-1 py-3">{weekday}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {days.map((day) => {
                        const items = byDay.get(day.key) ?? []
                        const visible = items.slice(0, MAX_VISIBLE)
                        const hidden = items.length - visible.length

                        return (
                            <div key={day.key} className={`min-h-[84px] border-t border-l border-border p-1 first:border-l-0 md:min-h-[120px] md:p-2 [&:nth-child(7n+1)]:border-l-0 ${day.inMonth ? "" : "bg-surface-2 text-text-muted"}`}>
                                <span className={`mb-1 inline-flex size-7 items-center justify-center rounded-full text-sm ${day.key === today ? "bg-primary font-semibold text-white" : ""}`}>
                                    {day.day}
                                </span>
                                <ul className="flex flex-col gap-1">
                                    {visible.map((appointment) => {
                                        const label = `${formatTime(appointment.scheduledAt)} · ${appointment.patient.user.name} · ${APPOINTMENT_STATUS_LABEL[appointment.status]}`
                                        const chipClass = `block truncate rounded-xs px-0.5 py-0.5 text-center text-[11px] leading-tight md:px-1.5 md:text-left md:text-[13px] ${STATUS_STYLE[appointment.status]}`
                                        const content = (
                                            <>
                                                <span className="font-semibold">{formatTime(appointment.scheduledAt)}</span>
                                                <span className="hidden md:inline"> {appointment.patient.user.name}</span>
                                            </>
                                        )

                                        return (
                                            <li key={appointment.id}>
                                                {canWrite && appointment.status !== "CANCELLED" ? (
                                                    <Link href={`/appointments/${appointment.id}/edit`} title={label} aria-label={label} className={`${chipClass} hover:opacity-80`}>{content}</Link>
                                                ) : (
                                                    <span title={label} aria-label={label} className={chipClass}>{content}</span>
                                                )}
                                            </li>
                                        )
                                    })}
                                    {hidden > 0 && <li className="px-1.5 text-[13px] font-medium text-text-muted">+{hidden} mais</li>}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
