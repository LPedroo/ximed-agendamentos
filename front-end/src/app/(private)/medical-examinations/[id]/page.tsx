import { notFound } from "next/navigation"
import { getMedicalExamination } from "@/actions/medical-examinations"
import { ButtonLink } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { Tag } from "@/components/ui/Tag"
import { EXAM_CATEGORY_LABEL } from "@/constants/labels"
import { EXAMINATION_WRITE_ROLES, hasRole } from "@/constants/permissions"
import { getCurrentUser } from "@/lib/session"
import { formatDateTime } from "@/utils"

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[13px] font-medium text-text-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-line">{children || "—"}</dd>
    </div>
  )
}

export default async function MedicalExaminationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [examination, user] = await Promise.all([getMedicalExamination(id), getCurrentUser()])

  if (!examination.ok) {
    if (examination.status === 404) notFound()
    return <ErrorMessage message={examination.message} />
  }

  const exam = examination.data
  const canWrite = !!user && hasRole(user.role, EXAMINATION_WRITE_ROLES)

  return (
    <>
      <PageHeader title={exam.examType.name} subtitle={`Paciente: ${exam.patient.user.name}`} />
      <section className="mx-auto max-w-3xl rounded-xl border border-border bg-white p-6 md:p-8">
        <dl className="grid gap-6 md:grid-cols-2">
          <Item label="Categoria"><Tag>{EXAM_CATEGORY_LABEL[exam.examType.category]}</Tag></Item>
          <Item label="Status">{exam.status}</Item>
          <Item label="Médico">{exam.doctor.user.name} · {exam.doctor.crm}</Item>
          <Item label="Agendamento">{exam.appointment ? formatDateTime(exam.appointment.scheduledAt) : null}</Item>
          <Item label="Realizado em">{exam.datePerformed ? formatDateTime(exam.datePerformed) : null}</Item>
          <Item label="Resultado em">{exam.dateResult ? formatDateTime(exam.dateResult) : null}</Item>
          <div className="md:col-span-2"><Item label="Resultado">{exam.result}</Item></div>
          <div className="md:col-span-2"><Item label="Laudo">{exam.report}</Item></div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          {canWrite && <ButtonLink href={`/medical-examinations/${exam.id}/edit`} arrow={false}>Editar</ButtonLink>}
          <ButtonLink href="/medical-examinations" variant="secondary" arrow={false}>Voltar</ButtonLink>
        </div>
      </section>
    </>
  )
}
