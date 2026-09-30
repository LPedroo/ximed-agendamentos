import { PageHeader } from "@/components/ui/PageHeader"
import { UserForm } from "@/components/users/UserForm"
import { USER_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function NewUserPage() {
  await requireRole(USER_WRITE_ROLES)

  return (
    <>
      <PageHeader title="Novo usuário" />
      <UserForm />
    </>
  )
}
