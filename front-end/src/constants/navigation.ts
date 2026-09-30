import type { UserRole } from "@shared/schemas/userSchema"
import { EXAM_TYPE_READ_ROLES, ROOM_READ_ROLES, USER_READ_ROLES } from "./permissions"

export type NavItem = { label: string; href: string; roles?: UserRole[] }

// `roles` ausente = visível para qualquer usuário autenticado.
export const NAV_ITEMS: NavItem[] = [
    { label: "Agendamentos", href: "/appointments" },
    { label: "Exames", href: "/medical-examinations" },
    { label: "Usuários", href: "/users", roles: USER_READ_ROLES },
    { label: "Salas", href: "/rooms", roles: ROOM_READ_ROLES },
    { label: "Tipos de exame", href: "/exam-types", roles: EXAM_TYPE_READ_ROLES },
]
