import { listExamTypes } from "@/actions/exam-types"
import { listMedicalExaminations } from "@/actions/medical-examinations"
import { MedicalExaminationsTable } from "@/components/medical-examinations/MedicalExaminationsTable"
import { ButtonLink } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { FilterBar } from "@/components/ui/FilterBar"
import { PageHeader } from "@/components/ui/PageHeader"
import { Pagination } from "@/components/ui/Pagination"
import { EXAMINATION_WRITE_ROLES, hasRole } from "@/constants/permissions"
import { getCurrentUser } from "@/lib/session"

const PAGE_SIZE = 10
type SearchParams = { page?: string; search?: string; examTypeId?: string; status?: string }

export default async function MedicalExaminationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { page = "1", ...filters } = await searchParams
  const user = await getCurrentUser()
  const canWrite = !!user && hasRole(user.role, EXAMINATION_WRITE_ROLES)

  const [result, examTypes] = await Promise.all([
    listMedicalExaminations({ page, limit: PAGE_SIZE, ...filters }),
    listExamTypes({ limit: 100, includeInactive: true }),
  ])

  return (
    <>
      <PageHeader
        title="Exames"
        subtitle={user?.role === "PATIENT" ? "Consulte os resultados dos seus exames." : "Exames realizados, resultados e laudos."}
        actions={canWrite ? <ButtonLink href="/medical-examinations/new">Registrar exame</ButtonLink> : undefined}
      />
      <FilterBar
        resetHref="/medical-examinations"
        values={filters}
        fields={[
          { name: "search", label: "Buscar", type: "text", placeholder: "Paciente, médico ou exame" },
          {
            name: "examTypeId",
            label: "Tipo de exame",
            type: "select",
            options: examTypes.ok ? examTypes.data.data.map((examType) => ({ value: examType.id, label: examType.name })) : [],
          },
          { name: "status", label: "Status", type: "text", placeholder: "Ex.: Finalizado" },
        ]}
      />
      {result.ok ? (
        <>
          <MedicalExaminationsTable examinations={result.data.data} canWrite={canWrite} />
          <Pagination page={result.data.meta.page} totalPages={result.data.meta.totalPages} total={result.data.meta.total} basePath="/medical-examinations" params={filters} />
        </>
      ) : (
        <ErrorMessage message={result.message} />
      )}
    </>
  )
}
