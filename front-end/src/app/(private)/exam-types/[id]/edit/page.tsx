import { notFound } from "next/navigation"
import { getExamType } from "@/actions/exam-types"
import { ExamTypeForm } from "@/components/exam-types/ExamTypeForm"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { EXAM_TYPE_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function EditExamTypePage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(EXAM_TYPE_WRITE_ROLES)
  const { id } = await params

  const examType = await getExamType(id)
  if (!examType.ok) {
    if (examType.status === 404) notFound()
    return <ErrorMessage message={examType.message} />
  }

  return (
    <>
      <PageHeader title="Editar tipo de exame" />
      <ExamTypeForm examType={examType.data} />
    </>
  )
}
