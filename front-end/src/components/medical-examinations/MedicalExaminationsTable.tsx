import type { MedicalExaminationResponse } from "@shared/schemas/medicalExaminationSchema"
import { deleteMedicalExamination } from "@/actions/medical-examinations"
import { ButtonLink } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { RowActionButton } from "@/components/ui/RowActionButton"
import { formatDateTime } from "@/utils"

export function MedicalExaminationsTable({ examinations, canWrite }: { examinations: MedicalExaminationResponse[]; canWrite: boolean }) {
    return (
        <DataTable
            rows={examinations}
            rowKey={(exam) => exam.id}
            emptyMessage="Nenhum exame encontrado."
            columns={[
                { header: "Exame", cell: (exam) => <span className="font-medium">{exam.examType.name}</span> },
                { header: "Paciente", cell: (exam) => exam.patient.user.name },
                { header: "Médico", cell: (exam) => exam.doctor.user.name },
                { header: "Status", cell: (exam) => exam.status ?? "—" },
                { header: "Realizado em", nowrap: true, cell: (exam) => (exam.datePerformed ? formatDateTime(exam.datePerformed) : "—") },
                {
                    header: "Ações",
                    align: "right",
                    cell: (exam) => (
                        <div className="flex items-start justify-end gap-1">
                            <ButtonLink href={`/medical-examinations/${exam.id}`} variant="secondary" size="sm" arrow={false}>Ver</ButtonLink>
                            {canWrite && (
                                <>
                                    <ButtonLink href={`/medical-examinations/${exam.id}/edit`} variant="secondary" size="sm" arrow={false}>Editar</ButtonLink>
                                    <RowActionButton label="Excluir" variant="danger" confirm="Excluir este exame? Essa ação não pode ser desfeita." action={deleteMedicalExamination.bind(null, exam.id)} />
                                </>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    )
}
