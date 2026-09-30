import { listRooms } from "@/actions/rooms"
import { RoomsTable } from "@/components/rooms/RoomsTable"
import { ButtonLink } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { FilterBar } from "@/components/ui/FilterBar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Pagination } from "@/components/ui/Pagination"
import { ROOM_STATUS_LABEL, ROOM_TYPE_LABEL } from "@/constants/labels"
import { hasRole, ROOM_READ_ROLES, ROOM_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

const PAGE_SIZE = 10
type SearchParams = { page?: string; search?: string; roomType?: string; status?: string }

export default async function RoomsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const user = await requireRole(ROOM_READ_ROLES)
  const canWrite = hasRole(user.role, ROOM_WRITE_ROLES)
  const { page = "1", ...filters } = await searchParams

  const result = await listRooms({ page, limit: PAGE_SIZE, ...filters })

  return (
    <>
      <PageHeader
        title="Salas"
        subtitle="Consultórios, salas de procedimento e laboratórios disponíveis para agendamento."
        actions={canWrite ? <ButtonLink href="/rooms/new">Nova sala</ButtonLink> : undefined}
      />
      <FilterBar
        resetHref="/rooms"
        values={filters}
        fields={[
          { name: "search", label: "Buscar", type: "text", placeholder: "Nome da sala" },
          { name: "roomType", label: "Tipo", type: "select", options: Object.entries(ROOM_TYPE_LABEL).map(([value, label]) => ({ value, label })) },
          { name: "status", label: "Situação", type: "select", options: Object.entries(ROOM_STATUS_LABEL).map(([value, label]) => ({ value, label })) },
        ]}
      />
      {result.ok ? (
        <>
          <RoomsTable rooms={result.data.data} canWrite={canWrite} />
          <Pagination page={result.data.meta.page} totalPages={result.data.meta.totalPages} total={result.data.meta.total} basePath="/rooms" params={filters} />
        </>
      ) : (
        <ErrorMessage message={result.message} />
      )}
    </>
  )
}
