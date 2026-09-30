import { getAppointmentFormOptions } from "@/actions/appointments"
import { AppointmentForm } from "@/components/appointments/AppointmentForm"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { APPOINTMENT_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function NewAppointmentPage() {
  await requireRole(APPOINTMENT_WRITE_ROLES)

  const options = await getAppointmentFormOptions()

  return (
    <>
      <PageHeader title="Novo agendamento" />
      {options.ok ? <AppointmentForm options={options.data} /> : <ErrorMessage message={options.message} />}
    </>
  )
}
