import { notFound } from "next/navigation"
import { getUser } from "@/actions/users"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { UserForm } from "@/components/users/UserForm"
import { USER_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(USER_WRITE_ROLES)
  const { id } = await params

  const user = await getUser(id)
  if (!user.ok) {
    if (user.status === 404) notFound()
    return <ErrorMessage message={user.message} />
  }

  return (
    <>
      <PageHeader title="Editar usuário" />
      <UserForm user={user.data} />
    </>
  )
}
