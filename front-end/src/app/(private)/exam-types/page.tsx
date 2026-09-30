import { listExamTypes } from "@/actions/exam-types"
import { ExamTypesTable } from "@/components/exam-types/ExamTypesTable"
import { ButtonLink } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { FilterBar } from "@/components/ui/FilterBar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Pagination } from "@/components/ui/Pagination"
import { EXAM_CATEGORY_LABEL } from "@/constants/labels"
import { EXAM_TYPE_READ_ROLES, EXAM_TYPE_WRITE_ROLES, hasRole } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

const PAGE_SIZE = 10
type SearchParams = { page?: string; search?: string; category?: string; includeInactive?: string }

export default async function ExamTypesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const user = await requireRole(EXAM_TYPE_READ_ROLES)
  const canWrite = hasRole(user.role, EXAM_TYPE_WRITE_ROLES)
  const { page = "1", ...filters } = await searchParams

  const result = await listExamTypes({ page, limit: PAGE_SIZE, ...filters })

  return (
    <>
      <PageHeader
        title="Tipos de exame"
        subtitle="Exames ocupacionais e complementares que podem ser agendados."
        actions={canWrite ? <ButtonLink href="/exam-types/new">Novo tipo de exame</ButtonLink> : undefined}
      />
      <FilterBar
        resetHref="/exam-types"
        values={filters}
        fields={[
          { name: "search", label: "Buscar", type: "text", placeholder: "Nome do exame" },
          { name: "category", label: "Categoria", type: "select", options: Object.entries(EXAM_CATEGORY_LABEL).map(([value, label]) => ({ value, label })) },
          { name: "includeInactive", label: "Incluir inativos", type: "checkbox" },
        ]}
      />
      {result.ok ? (
        <>
          <ExamTypesTable examTypes={result.data.data} canWrite={canWrite} />
          <Pagination page={result.data.meta.page} totalPages={result.data.meta.totalPages} total={result.data.meta.total} basePath="/exam-types" params={filters} />
        </>
      ) : (
        <ErrorMessage message={result.message} />
      )}
    </>
  )
}
