import { listAppointments, listAppointmentsBetween } from "@/actions/appointments"
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar"
import { AppointmentFilters } from "@/components/appointments/AppointmentFilters"
import { AppointmentsTable } from "@/components/appointments/AppointmentsTable"
import { ButtonLink } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { Pagination } from "@/components/ui/Pagination"
import { APPOINTMENT_WRITE_ROLES, hasRole } from "@/constants/permissions"
import { getCurrentUser } from "@/lib/session"
import { buildMonthGrid, endOfDayIso, parseMonth, startOfDayIso } from "@/utils"

const PAGE_SIZE = 10
type SearchParams = { page?: string; status?: string; from?: string; to?: string; month?: string }

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { page = "1", status, from, to, month: monthParam } = await searchParams
  const user = await getCurrentUser()
  const canWrite = !!user && hasRole(user.role, APPOINTMENT_WRITE_ROLES)

  const filters = { status, from, to }
  const month = parseMonth(monthParam)
  const grid = buildMonthGrid(month)

  // O calendário mostra o mês inteiro (com o mesmo filtro de status); período e página valem só para a tabela.
  const [result, calendar] = await Promise.all([
    listAppointments({
      page,
      limit: PAGE_SIZE,
      status,
      from: from ? startOfDayIso(from) : undefined,
      to: to ? endOfDayIso(to) : undefined,
    }),
    listAppointmentsBetween({ from: startOfDayIso(grid[0]!.key), to: endOfDayIso(grid[grid.length - 1]!.key), status }),
  ])

  return (
    <>
      <PageHeader
        title="Agendamentos"
        subtitle="Consulte, altere a data, cancele ou exclua os agendamentos de exames."
        actions={canWrite ? <ButtonLink href="/appointments/new">Novo agendamento</ButtonLink> : undefined}
      />
      <AppointmentFilters {...filters} />
      {result.ok ? (
        <>
          <AppointmentsTable appointments={result.data.data} canWrite={canWrite} />
          <Pagination
            page={result.data.meta.page}
            totalPages={result.data.meta.totalPages}
            total={result.data.meta.total}
            basePath="/appointments"
            params={{ ...filters, month: monthParam }}
          />
        </>
      ) : (
        <ErrorMessage message={result.message} />
      )}
      {calendar.ok ? (
        <AppointmentCalendar month={month} appointments={calendar.data} params={{ ...filters, page }} canWrite={canWrite} />
      ) : (
        <div className="mt-12"><ErrorMessage message={calendar.message} /></div>
      )}
    </>
  )
}
