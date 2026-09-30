import { getExaminationFormOptions } from "@/actions/medical-examinations"
import { MedicalExaminationForm } from "@/components/medical-examinations/MedicalExaminationForm"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { EXAMINATION_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function NewMedicalExaminationPage() {
  await requireRole(EXAMINATION_WRITE_ROLES)
  const options = await getExaminationFormOptions()

  return (
    <>
      <PageHeader title="Registrar exame" />
      {options.ok ? <MedicalExaminationForm options={options.data} /> : <ErrorMessage message={options.message} />}
    </>
  )
}
