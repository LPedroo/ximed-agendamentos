import type { ExamTypeResponse } from "@shared/schemas/examTypeSchema"
import { disableExamType, enableExamType } from "@/actions/exam-types"
import { ButtonLink } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { RowActionButton } from "@/components/ui/RowActionButton"
import { ActiveBadge, Tag } from "@/components/ui/Tag"
import { EXAM_CATEGORY_LABEL } from "@/constants/labels"

export function ExamTypesTable({ examTypes, canWrite }: { examTypes: ExamTypeResponse[]; canWrite: boolean }) {
    return (
        <DataTable
            rows={examTypes}
            rowKey={(examType) => examType.id}
            emptyMessage="Nenhum tipo de exame encontrado."
            columns={[
                { header: "Nome", cell: (examType) => <span className="font-medium">{examType.name}</span> },
                { header: "Categoria", cell: (examType) => <Tag>{EXAM_CATEGORY_LABEL[examType.category]}</Tag> },
                { header: "Descrição", cell: (examType) => <span className="text-text-muted">{examType.description ?? "—"}</span> },
                { header: "Situação", cell: (examType) => <ActiveBadge active={examType.active} /> },
                ...(canWrite
                    ? [
                          {
                              header: "Ações",
                              align: "right" as const,
                              cell: (examType: ExamTypeResponse) => (
                                  <div className="flex items-start justify-end gap-1">
                                      <ButtonLink href={`/exam-types/${examType.id}/edit`} variant="secondary" size="sm" arrow={false}>Editar</ButtonLink>
                                      {examType.active ? (
                                          <RowActionButton label="Desativar" variant="danger" confirm={`Desativar "${examType.name}"? Ele deixará de aparecer para novos agendamentos.`} action={disableExamType.bind(null, examType.id)} />
                                      ) : (
                                          <RowActionButton label="Ativar" action={enableExamType.bind(null, examType.id)} />
                                      )}
                                  </div>
                              ),
                          },
                      ]
                    : []),
            ]}
        />
    )
}
