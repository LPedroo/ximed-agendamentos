import type { UserResponse } from "@shared/schemas/userSchema"
import { disableUser, enableUser } from "@/actions/users"
import { ButtonLink } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { RowActionButton } from "@/components/ui/RowActionButton"
import { ActiveBadge, Tag } from "@/components/ui/Tag"
import { USER_ROLE_LABEL } from "@/constants/labels"
import { formatCpf, formatPhone } from "@/utils"

export function UsersTable({ users, canWrite }: { users: UserResponse[]; canWrite: boolean }) {
    return (
        <DataTable
            rows={users}
            rowKey={(user) => user.id}
            emptyMessage="Nenhum usuário encontrado."
            columns={[
                { header: "Nome", cell: (user) => <span className="font-medium">{user.name}</span> },
                { header: "E-mail", cell: (user) => user.email },
                { header: "CPF", nowrap: true, cell: (user) => formatCpf(user.cpf) },
                { header: "Telefone", nowrap: true, cell: (user) => (user.telephone ? formatPhone(user.telephone) : "—") },
                {
                    header: "Perfil",
                    cell: (user) => (
                        <span className="flex flex-col items-start gap-1">
                            <Tag>{USER_ROLE_LABEL[user.role]}</Tag>
                            {user.doctor && <span className="text-[13px] text-text-muted">{user.doctor.crm}</span>}
                        </span>
                    ),
                },
                { header: "Situação", cell: (user) => <ActiveBadge active={user.active} /> },
                ...(canWrite
                    ? [
                          {
                              header: "Ações",
                              align: "right" as const,
                              cell: (user: UserResponse) => (
                                  <div className="flex items-start justify-end gap-1">
                                      <ButtonLink href={`/users/${user.id}/edit`} variant="secondary" size="sm" arrow={false}>Editar</ButtonLink>
                                      {user.active ? (
                                          <RowActionButton label="Desativar" variant="danger" confirm={`Desativar ${user.name}? O usuário perderá o acesso.`} action={disableUser.bind(null, user.id)} />
                                      ) : (
                                          <RowActionButton label="Ativar" action={enableUser.bind(null, user.id)} />
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
