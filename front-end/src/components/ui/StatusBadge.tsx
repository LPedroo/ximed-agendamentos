import type { AppointmentStatus } from "@shared/schemas/appointmentSchema"
import { APPOINTMENT_STATUS_LABEL } from "@/constants/labels"

// Combinações com contraste AA. Amarelo só com texto navy.
export const STATUS_STYLE: Record<AppointmentStatus, string> = {
    SCHEDULED: "bg-tint text-primary",
    CONFIRMED: "bg-primary text-white",
    CANCELLED: "bg-surface text-text-muted",
    ATTENDED: "bg-secondary text-white",
    NO_SHOW: "bg-warning text-secondary",
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium ${STATUS_STYLE[status]}`}>
            {APPOINTMENT_STATUS_LABEL[status]}
        </span>
    )
}
