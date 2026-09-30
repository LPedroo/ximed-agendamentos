import { notFound } from "next/navigation"
import { getExaminationFormOptions, getMedicalExamination } from "@/actions/medical-examinations"
import { MedicalExaminationForm } from "@/components/medical-examinations/MedicalExaminationForm"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { EXAMINATION_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function EditMedicalExaminationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(EXAMINATION_WRITE_ROLES)
  const { id } = await params

  const [examination, options] = await Promise.all([getMedicalExamination(id), getExaminationFormOptions()])
  if (!examination.ok) {
    if (examination.status === 404) notFound()
    return <ErrorMessage message={examination.message} />
  }
  if (!options.ok) return <ErrorMessage message={options.message} />

  return (
    <>
      <PageHeader title="Editar exame" />
      <MedicalExaminationForm options={options.data} examination={examination.data} />
    </>
  )
}
