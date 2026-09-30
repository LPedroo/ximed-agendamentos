import "server-only"
import { redirect } from "next/navigation"
import type { UserResponse, UserRole } from "@shared/schemas/userSchema"
import { hasRole } from "@/constants/permissions"
import { getCurrentUser } from "./session"

// Para páginas: exige sessão válida e uma das roles; caso contrário redireciona.
export async function requireRole(allowed: UserRole[]): Promise<UserResponse> {
    const user = await getCurrentUser()
    if (!user) redirect("/login?expired=1")
    if (!hasRole(user.role, allowed)) redirect("/appointments")
    return user
}
