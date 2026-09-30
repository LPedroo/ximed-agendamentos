import { notFound } from "next/navigation"
import { getAppointment } from "@/actions/appointments"
import { AppointmentRescheduleForm } from "@/components/appointments/AppointmentRescheduleForm"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { APPOINTMENT_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireRole(APPOINTMENT_WRITE_ROLES)

  const appointment = await getAppointment(id)
  if (!appointment.ok) {
    if (appointment.status === 404) notFound()
    return <ErrorMessage message={appointment.message} />
  }

  return (
    <>
      <PageHeader title="Reagendar" subtitle="Altere a data e o horário. Ao salvar, o agendamento fica como confirmado." />
      <AppointmentRescheduleForm appointment={appointment.data} />
    </>
  )
}
