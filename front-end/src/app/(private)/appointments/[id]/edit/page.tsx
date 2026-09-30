import { notFound } from "next/navigation"
import { getAppointment, getAppointmentFormOptions } from "@/actions/appointments"
import { AppointmentForm } from "@/components/appointments/AppointmentForm"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { APPOINTMENT_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireRole(APPOINTMENT_WRITE_ROLES)

  const [appointment, options] = await Promise.all([getAppointment(id), getAppointmentFormOptions()])
  if (!appointment.ok) {
    if (appointment.status === 404) notFound()
    return <ErrorMessage message={appointment.message} />
  }
  if (!options.ok) return <ErrorMessage message={options.message} />

  return (
    <>
      <PageHeader title="Editar agendamento" />
      <AppointmentForm options={options.data} appointment={appointment.data} />
    </>
  )
}
