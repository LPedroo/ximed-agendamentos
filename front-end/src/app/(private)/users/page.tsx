import { listUsers } from "@/actions/users"
import { UsersTable } from "@/components/users/UsersTable"
import { ButtonLink } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { FilterBar } from "@/components/ui/FilterBar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Pagination } from "@/components/ui/Pagination"
import { USER_ROLE_LABEL } from "@/constants/labels"
import { hasRole, USER_READ_ROLES, USER_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

const PAGE_SIZE = 10
type SearchParams = { page?: string; search?: string; role?: string; includeInactive?: string }

export default async function UsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const user = await requireRole(USER_READ_ROLES)
  const canWrite = hasRole(user.role, USER_WRITE_ROLES)
  const { page = "1", ...filters } = await searchParams

  const result = await listUsers({ page, limit: PAGE_SIZE, ...filters })

  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle="Pacientes, médicos, operadores e administradores do sistema."
        actions={canWrite ? <ButtonLink href="/users/new">Novo usuário</ButtonLink> : undefined}
      />
      <FilterBar
        resetHref="/users"
        values={filters}
        fields={[
          { name: "search", label: "Buscar", type: "text", placeholder: "Nome, e-mail ou CPF" },
          { name: "role", label: "Perfil", type: "select", options: Object.entries(USER_ROLE_LABEL).map(([value, label]) => ({ value, label })) },
          { name: "includeInactive", label: "Incluir inativos", type: "checkbox" },
        ]}
      />
      {result.ok ? (
        <>
          <UsersTable users={result.data.data} canWrite={canWrite} />
          <Pagination page={result.data.meta.page} totalPages={result.data.meta.totalPages} total={result.data.meta.total} basePath="/users" params={filters} />
        </>
      ) : (
        <ErrorMessage message={result.message} />
      )}
    </>
  )
}
