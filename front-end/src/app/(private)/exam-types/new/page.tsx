import { ExamTypeForm } from "@/components/exam-types/ExamTypeForm"
import { PageHeader } from "@/components/ui/PageHeader"
import { EXAM_TYPE_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function NewExamTypePage() {
  await requireRole(EXAM_TYPE_WRITE_ROLES)

  return (
    <>
      <PageHeader title="Novo tipo de exame" />
      <ExamTypeForm />
    </>
  )
}
